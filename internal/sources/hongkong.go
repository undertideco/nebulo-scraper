package sources

import (
	"context"
	"encoding/xml"
)

const hongKongURL = "http://www.aqhi.gov.hk/epd/ddata/html/out/24pc_Eng.xml"

func scrapeHongKong(ctx context.Context, r *Runner) ([]City, error) {
	body, err := r.Client.Get(ctx, hongKongURL, "")
	if err != nil {
		return nil, err
	}

	var resp hongKongResponse
	if err := xml.Unmarshal(body, &resp); err != nil {
		return nil, err
	}

	seen := make(map[string]struct{}, len(resp.Cities))
	latestByStation := make([]hongKongPollutantConcentration, 0, len(resp.Cities))
	for idx := len(resp.Cities) - 1; idx >= 0; idx-- {
		city := resp.Cities[idx]
		if _, ok := seen[city.StationName]; ok {
			continue
		}

		seen[city.StationName] = struct{}{}
		latestByStation = append(latestByStation, city)
	}

	geocoder, err := r.RequireGeocoder()
	if err != nil {
		return nil, err
	}

	return mapConcurrent(ctx, latestByStation, 2, func(ctx context.Context, city hongKongPollutantConcentration) (City, error) {
		location, err := geocoder.LatLng(ctx, city.StationName+", Hong Kong")
		if err != nil {
			return City{}, err
		}

		return City{
			Name:     city.StationName,
			Region:   "Hong Kong",
			Data:     hongKongPM25(city.PM25),
			Location: location,
		}, nil
	})
}

func hongKongPM25(value string) int {
	if value == "-" {
		return 0
	}

	return roundFloatStringDefault(value, 0)
}

type hongKongResponse struct {
	Cities []hongKongPollutantConcentration `xml:"PollutantConcentration"`
}

type hongKongPollutantConcentration struct {
	StationName string `xml:"StationName"`
	DateTime    string `xml:"DateTime"`
	NO2         string `xml:"NO2"`
	O3          string `xml:"O3"`
	PM10        string `xml:"PM10"`
	PM25        string `xml:"PM2.5"`
}
