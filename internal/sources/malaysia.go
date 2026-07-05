package sources

import (
	"context"

	"github.com/undertideco/nebulo-scraper/internal/httpclient"
)

const malaysiaURL = "https://eqms.doe.gov.my/api3/publicmapproxy/PUBLIC_DISPLAY/CAQM_MCAQM_Current_Reading/MapServer/0/query?f=json&outFields=*&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1"

func scrapeMalaysia(ctx context.Context, r *Runner) ([]City, error) {
	var resp malaysiaResponse
	if err := httpclient.GetJSON(ctx, r.Client, malaysiaURL, &resp); err != nil {
		return nil, err
	}

	cities := make([]City, 0, len(resp.Features))
	for _, feature := range resp.Features {
		attrs := feature.Attributes
		cities = append(cities, City{
			Name:   attrs.StationLocation,
			Region: "Malaysia",
			Data:   attrs.API,
			Location: Location{
				Lat: attrs.Latitude,
				Lng: attrs.Longitude,
			},
		})
	}

	return cities, nil
}

type malaysiaResponse struct {
	Features []struct {
		Attributes struct {
			API             int     `json:"API"`
			StationLocation string  `json:"STATION_LOCATION"`
			Longitude       float64 `json:"LONGITUDE"`
			Latitude        float64 `json:"LATITUDE"`
		} `json:"attributes"`
	} `json:"features"`
}
