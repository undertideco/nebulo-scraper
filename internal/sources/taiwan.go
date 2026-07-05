package sources

import (
	"context"
	"errors"
	"net/url"

	"github.com/undertideco/nebulo-scraper/internal/httpclient"
)

const taiwanBaseURL = "https://data.moenv.gov.tw/api/v2/aqx_p_02"

var taiwanGeocoderExceptions = map[string]string{
	"安南, 臺南市": "安南",
}

func scrapeTaiwan(ctx context.Context, r *Runner) ([]City, error) {
	if r.MOENVAPIKey == "" {
		return nil, errors.New("MOENV_API_KEY is required for Taiwan")
	}

	values := url.Values{}
	values.Set("api_key", r.MOENVAPIKey)

	var resp []taiwanPM25Record
	if err := httpclient.GetJSON(ctx, r.Client, taiwanBaseURL+"?"+values.Encode(), &resp); err != nil {
		return nil, err
	}

	geocoder, err := r.RequireGeocoder()
	if err != nil {
		return nil, err
	}

	return mapConcurrent(ctx, resp, 2, func(ctx context.Context, record taiwanPM25Record) (City, error) {
		name := record.Site + ", " + record.County
		address := name
		if replacement, ok := taiwanGeocoderExceptions[name]; ok {
			address = replacement
		}

		location, err := geocoder.LatLng(ctx, address)
		if err != nil {
			return City{}, err
		}

		return City{
			Name:     name,
			Region:   "Taiwan",
			Data:     atoiDefault(record.PM25, 0),
			Location: location,
		}, nil
	})
}

type taiwanPM25Record struct {
	Site             string `json:"site"`
	County           string `json:"county"`
	PM25             string `json:"pm25"`
	DataCreationDate string `json:"datacreationdate"`
	ItemUnit         string `json:"itemunit"`
}
