package scraper

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/undertideco/nebulo-scraper/internal/httpclient"
)

// GoogleGeocoder implements Geocoder using the Google Geocoding API.
type GoogleGeocoder struct {
	apiKey string
	client *httpclient.Client
	cache  GeocodeCache
}

// NewGoogleGeocoder creates a GoogleGeocoder with an in-memory geocode cache.
func NewGoogleGeocoder(apiKey string, client *http.Client) *GoogleGeocoder {
	return NewGoogleGeocoderWithCache(apiKey, client, NewMemoryGeocodeCache())
}

// NewGoogleGeocoderWithCache creates a GoogleGeocoder with a caller-supplied
// cache. A nil cache falls back to an in-memory cache.
func NewGoogleGeocoderWithCache(apiKey string, client *http.Client, cache GeocodeCache) *GoogleGeocoder {
	if cache == nil {
		cache = NewMemoryGeocodeCache()
	}

	return &GoogleGeocoder{
		apiKey: apiKey,
		client: httpclient.New(client),
		cache:  cache,
	}
}

// LatLng resolves an address to a Location.
func (g *GoogleGeocoder) LatLng(ctx context.Context, address string) (Location, error) {
	if g.apiKey == "" {
		return Location{}, errors.New("missing Google Geocoding API key")
	}

	if cached, ok, err := g.cache.GetLocation(ctx, address); err != nil {
		return Location{}, err
	} else if ok {
		return cached, nil
	}

	values := url.Values{}
	values.Set("address", address)
	values.Set("key", g.apiKey)

	var resp googleGeocodeResponse
	if err := g.get(ctx, values, &resp); err != nil {
		return Location{}, err
	}
	if len(resp.Results) == 0 {
		return Location{}, fmt.Errorf("no geocoding results for %q", address)
	}

	location := resp.Results[0].Geometry.Location
	if err := g.cache.SetLocation(ctx, address, location); err != nil {
		return Location{}, err
	}

	return location, nil
}

// Address resolves coordinates to a compact place name.
func (g *GoogleGeocoder) Address(ctx context.Context, lat float64, lng float64) (string, error) {
	if g.apiKey == "" {
		return "", errors.New("missing Google Geocoding API key")
	}

	if cached, ok, err := g.cache.GetAddress(ctx, lat, lng); err != nil {
		return "", err
	} else if ok {
		return cached, nil
	}

	values := url.Values{}
	values.Set("latlng", geocodeLocationKey(lat, lng))
	values.Set("key", g.apiKey)

	var resp googleGeocodeResponse
	if err := g.get(ctx, values, &resp); err != nil {
		return "", err
	}
	if len(resp.Results) == 0 {
		return "", nil
	}

	parts := make([]string, 0)
	for _, component := range resp.Results[0].AddressComponents {
		if component.HasType("route") || component.HasType("sublocality") || component.HasType("locality") {
			parts = append(parts, component.ShortName)
		}
	}

	address := strings.Join(parts, ", ")
	if err := g.cache.SetAddress(ctx, lat, lng, address); err != nil {
		return "", err
	}

	return address, nil
}

func (g *GoogleGeocoder) get(ctx context.Context, values url.Values, dst *googleGeocodeResponse) error {
	body, err := g.client.Get(ctx, "https://maps.googleapis.com/maps/api/geocode/json?"+values.Encode(), "application/json")
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, dst); err != nil {
		return err
	}
	if dst.Status != "OK" && dst.Status != "ZERO_RESULTS" {
		return fmt.Errorf("Google geocoding status %q", dst.Status)
	}

	return nil
}

type googleGeocodeResponse struct {
	Status  string `json:"status"`
	Results []struct {
		AddressComponents []googleAddressComponent `json:"address_components"`
		Geometry          struct {
			Location Location `json:"location"`
		} `json:"geometry"`
	} `json:"results"`
}

type googleAddressComponent struct {
	ShortName string   `json:"short_name"`
	Types     []string `json:"types"`
}

func (c googleAddressComponent) HasType(target string) bool {
	for _, typ := range c.Types {
		if typ == target {
			return true
		}
	}

	return false
}

func geocodeLocationKey(lat float64, lng float64) string {
	return strconv.FormatFloat(lat, 'f', -1, 64) + "," + strconv.FormatFloat(lng, 'f', -1, 64)
}
