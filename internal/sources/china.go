package sources

import (
	"context"

	"github.com/undertideco/nebulo-scraper/internal/httpclient"
)

const chinaURL = "http://www.cnemc.cn/getIndexData.do"

var chinaGeocoderExceptions = map[string]string{
	"玉树州": "Yushu, China",
}

func scrapeChina(ctx context.Context, r *Runner) ([]City, error) {
	var resp chinaResponse
	if err := httpclient.GetJSON(ctx, r.Client, chinaURL, &resp); err != nil {
		return nil, err
	}

	r.Logger.Printf("Scraped %d for China", len(resp.AirList))

	geocoder, err := r.RequireGeocoder()
	if err != nil {
		return nil, err
	}

	return mapConcurrent(ctx, resp.AirList, 2, func(ctx context.Context, point chinaCityDataPoint) (City, error) {
		address := point.CityName
		if replacement, ok := chinaGeocoderExceptions[address]; ok {
			address = replacement
		}

		location, err := geocoder.LatLng(ctx, address)
		if err != nil {
			r.Logger.Printf("Using dummy location for %s: %v", point.CityName, err)
			location = Location{}
		}

		return City{
			Name:     point.CityName,
			Region:   "China",
			Data:     atoiDefault(point.PM25, 0),
			Location: location,
		}, nil
	})
}

type chinaResponse struct {
	AirList []chinaCityDataPoint `json:"airList"`
}

type chinaCityDataPoint struct {
	PM25     string `json:"PM25"`
	CityName string `json:"CITYNAME"`
	AirCity  struct {
		CityName   string `json:"CITY_NAME"`
		EnCityName string `json:"EN_CITY_NAME"`
	} `json:"airCity"`
}
