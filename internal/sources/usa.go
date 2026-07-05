package sources

import (
	"context"
	"errors"
	"net/url"
	"strings"

	"github.com/undertideco/nebulo-scraper/internal/httpclient"
)

const usaBaseURL = "https://www.airnowapi.org/aq/data/"

func scrapeUSA(ctx context.Context, r *Runner) ([]City, error) {
	if r.AirNowKey == "" {
		return nil, errors.New("AIRNOW_KEY is required for USA")
	}

	values := url.Values{}
	values.Set("parameters", "PM25")
	values.Set("BBOX", "-124.205070,28.716781,-75.337882,45.419415")
	values.Set("dataType", "A")
	values.Set("format", "application/json")
	values.Set("verbose", "0")
	values.Set("API_KEY", r.AirNowKey)

	var resp []usaMeasurement
	if err := httpclient.GetJSON(ctx, r.Client, usaBaseURL+"?"+values.Encode(), &resp); err != nil {
		return nil, err
	}

	geocoder, err := r.RequireGeocoder()
	if err != nil {
		return nil, err
	}

	cities, err := mapConcurrent(ctx, resp, 2, func(ctx context.Context, measurement usaMeasurement) (City, error) {
		address, err := geocoder.Address(ctx, measurement.Latitude, measurement.Longitude)
		if err != nil {
			return City{}, err
		}

		return City{
			Name:   address,
			Region: "United States of America",
			Data:   measurement.AQI,
			Location: Location{
				Lat: measurement.Latitude,
				Lng: measurement.Longitude,
			},
		}, nil
	})
	if err != nil {
		return nil, err
	}

	filtered := cities[:0]
	for _, city := range cities {
		if strings.TrimSpace(city.Name) != "" {
			filtered = append(filtered, city)
		}
	}

	return filtered, nil
}

type usaMeasurement struct {
	Latitude  float64 `json:"Latitude"`
	Longitude float64 `json:"Longitude"`
	UTC       string  `json:"UTC"`
	Parameter string  `json:"Parameter"`
	Unit      string  `json:"Unit"`
	AQI       int     `json:"AQI"`
	Category  int     `json:"Category"`
}
