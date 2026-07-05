package sources

import (
	"context"

	"github.com/undertideco/nebulo-scraper/internal/httpclient"
)

const singaporeURL = "https://api.data.gov.sg/v1/environment/psi"

func scrapeSingapore(ctx context.Context, r *Runner) ([]City, error) {
	var resp singaporeResponse
	if err := httpclient.GetJSON(ctx, r.Client, singaporeURL, &resp); err != nil {
		return nil, err
	}
	if len(resp.Items) == 0 {
		return nil, nil
	}

	locations := make(map[string]singaporeRegionMetadata, len(resp.RegionMetadata))
	for _, metadata := range resp.RegionMetadata {
		locations[metadata.Name] = metadata
	}

	readings := resp.Items[0].Readings.PSITwentyFourHourly
	cities := make([]City, 0, len(readings))
	for region, data := range readings {
		metadata := locations[region]
		cities = append(cities, City{
			Name:   capitalize(metadata.Name) + ", Singapore",
			Region: "Singapore",
			Data:   data,
			Location: Location{
				Lat: metadata.LabelLocation.Latitude,
				Lng: metadata.LabelLocation.Longitude,
			},
		})
	}

	return cities, nil
}

type singaporeResponse struct {
	RegionMetadata []singaporeRegionMetadata `json:"region_metadata"`
	Items          []struct {
		Readings struct {
			PSITwentyFourHourly map[string]int `json:"psi_twenty_four_hourly"`
		} `json:"readings"`
	} `json:"items"`
}

type singaporeRegionMetadata struct {
	Name          string `json:"name"`
	LabelLocation struct {
		Latitude  float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
	} `json:"label_location"`
}
