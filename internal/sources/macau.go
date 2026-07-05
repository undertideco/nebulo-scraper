package sources

import (
	"context"

	"github.com/undertideco/nebulo-scraper/internal/httpclient"
)

const macauURL = "https://cms.smg.gov.mo/uploads/sync/json/latestAirConcentration.json"

type macauStationMeta struct {
	key      string
	name     string
	location Location
}

var macauStations = []macauStationMeta{
	{key: "enhopolu", name: "澳門高密度住宅區", location: Location{Lat: 22.213889, Lng: 113.542778}},
	{key: "pohopolu", name: "澳門路邊站", location: Location{Lat: 22.195833, Lng: 113.544722}},
	{key: "tghopolu", name: "氹仔一般性", location: Location{Lat: 22.16, Lng: 113.565}},
	{key: "tchopolu", name: "氹仔高密度住宅區", location: Location{Lat: 22.159574, Lng: 113.554088}},
	{key: "cdhopolu", name: "路環一般性", location: Location{Lat: 22.125278, Lng: 113.554444}},
	{key: "khhopolu", name: "九澳路邊站", location: Location{Lat: 22.13271, Lng: 113.584168}},
}

func scrapeMacau(ctx context.Context, r *Runner) ([]City, error) {
	var resp map[string]macauStation
	if err := httpclient.GetJSON(ctx, r.Client, macauURL, &resp); err != nil {
		return nil, err
	}

	cities := make([]City, 0, len(macauStations))
	for _, station := range macauStations {
		cities = append(cities, City{
			Name:     station.name,
			Region:   "Macau",
			Location: station.location,
			Data:     roundOptionalFloatStringDefault(resp[station.key].HEPM25, 0),
		})
	}

	return cities, nil
}

type macauStation struct {
	DDTT   string  `json:"DDTT"`
	HEPM10 *string `json:"HE_PM10"`
	HEPM25 *string `json:"HE_PM2_5"`
	HENO2  string  `json:"HE_NO2"`
	HECO   string  `json:"HE_CO"`
	HEO3   string  `json:"HE_O3"`
	HESO2  string  `json:"HE_SO2"`
}
