package sources

import (
	"context"
	"net/url"
	"strconv"
	"time"

	"github.com/undertideco/nebulo-scraper/internal/httpclient"
)

const (
	netherlandsStationsURL     = "https://api.luchtmeetnet.nl/open_api/stations"
	netherlandsMeasurementsURL = "https://api.luchtmeetnet.nl/open_api/measurements"
)

func scrapeNetherlands(ctx context.Context, r *Runner) ([]City, error) {
	stations, err := fetchNetherlandsPages[netherlandsStation](ctx, r, netherlandsStationsURL, nil)
	if err != nil {
		return nil, err
	}

	r.Logger.Printf("Netherlands: Retrieved %d stations", len(stations))

	stationLocations := make(map[string]string, len(stations))
	for _, station := range stations {
		stationLocations[station.Number] = station.Location
	}

	now := time.Now().UTC()
	values := url.Values{}
	values.Set("formula", "PM25")
	values.Set("start", now.Add(-time.Hour).Format(time.RFC3339Nano))
	values.Set("end", now.Format(time.RFC3339Nano))

	measurements, err := fetchNetherlandsPages[netherlandsMeasurement](ctx, r, netherlandsMeasurementsURL, values)
	if err != nil {
		return nil, err
	}

	geocoder, err := r.RequireGeocoder()
	if err != nil {
		return nil, err
	}

	return mapConcurrent(ctx, measurements, 2, func(ctx context.Context, measurement netherlandsMeasurement) (City, error) {
		name := stationLocations[measurement.StationNumber]
		location, err := geocoder.LatLng(ctx, name)
		if err != nil {
			return City{}, err
		}

		return City{
			Name:     name,
			Region:   "Netherlands",
			Data:     roundFloat(measurement.Value),
			Location: location,
		}, nil
	})
}

func fetchNetherlandsPages[T any](ctx context.Context, r *Runner, baseURL string, values url.Values) ([]T, error) {
	items := make([]T, 0)
	page := 1

	for {
		pageValues := url.Values{}
		for key, vals := range values {
			for _, val := range vals {
				pageValues.Add(key, val)
			}
		}
		pageValues.Set("page", strconv.Itoa(page))

		var resp netherlandsResponse[[]T]
		if err := httpclient.GetJSON(ctx, r.Client, baseURL+"?"+pageValues.Encode(), &resp); err != nil {
			return nil, err
		}

		items = append(items, resp.Data...)
		if resp.Pagination.CurrentPage == resp.Pagination.LastPage || len(resp.Data) == 0 {
			break
		}

		page = resp.Pagination.NextPage
	}

	return items, nil
}

type netherlandsStation struct {
	Number   string `json:"number"`
	Location string `json:"location"`
}

type netherlandsMeasurement struct {
	StationNumber     string  `json:"station_number"`
	Value             float64 `json:"value"`
	TimestampMeasured string  `json:"timestamp_measured"`
	Formula           string  `json:"formula"`
}

type netherlandsResponse[T any] struct {
	Pagination struct {
		LastPage    int `json:"last_page"`
		CurrentPage int `json:"current_page"`
		NextPage    int `json:"next_page"`
	} `json:"pagination"`
	Data T `json:"data"`
}
