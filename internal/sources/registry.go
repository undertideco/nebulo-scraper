package sources

import (
	"context"
	"errors"
	"log"

	"github.com/undertideco/nebulo-scraper/internal/httpclient"
	"github.com/undertideco/nebulo-scraper/internal/model"
)

type City = model.City
type Location = model.Location
type Geocoder = model.Geocoder

type Runner struct {
	Client      *httpclient.Client
	Geocoder    Geocoder
	AirNowKey   string
	MOENVAPIKey string
	Logger      *log.Logger
}

type Source struct {
	Name   string
	Scrape func(context.Context, *Runner) ([]City, error)
}

func All() []Source {
	return []Source{
		{Name: "china", Scrape: scrapeChina},
		{Name: "hongKong", Scrape: scrapeHongKong},
		{Name: "macau", Scrape: scrapeMacau},
		{Name: "malaysia", Scrape: scrapeMalaysia},
		{Name: "netherlands", Scrape: scrapeNetherlands},
		{Name: "singapore", Scrape: scrapeSingapore},
		{Name: "taiwan", Scrape: scrapeTaiwan},
		{Name: "usa", Scrape: scrapeUSA},
	}
}

func (r *Runner) RequireGeocoder() (Geocoder, error) {
	if r.Geocoder == nil {
		return nil, errors.New("geocoder is required; set GOOGLE_GEOCODING_API_KEY or provide scraper.Options.Geocoder")
	}

	return r.Geocoder, nil
}
