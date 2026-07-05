package scraper

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/undertideco/nebulo-scraper/internal/httpclient"
	"github.com/undertideco/nebulo-scraper/internal/sources"
)

// Options configures a Runner.
//
// Configuration provides API keys and other environment-backed settings.
// HTTPClient, Geocoder, GeocodeCache, and Logger are optional dependency
// injection points for programmatic consumers and tests.
type Options struct {
	Configuration Configuration
	HTTPClient    *http.Client
	Geocoder      Geocoder
	GeocodeCache  GeocodeCache
	Logger        *log.Logger
}

// Runner coordinates the registered internal scraper sources.
type Runner struct {
	sources *sources.Runner
}

// SourceResult contains the outcome of scraping one source.
type SourceResult struct {
	Name   string
	Cities []City
	Err    error
}

// New builds a Runner from Options.
//
// If Options.Geocoder is nil and Configuration.GoogleGeocodingAPIKey is set,
// New creates a GoogleGeocoder. If Options.GeocodeCache is nil, that geocoder
// uses an in-memory cache.
func New(opts Options) *Runner {
	client := httpclient.New(opts.HTTPClient)
	geocoder := opts.Geocoder
	if geocoder == nil && opts.Configuration.GoogleGeocodingAPIKey != "" {
		geocoder = NewGoogleGeocoderWithCache(opts.Configuration.GoogleGeocodingAPIKey, opts.HTTPClient, opts.GeocodeCache)
	}

	logger := opts.Logger
	if logger == nil {
		logger = log.New(os.Stderr, "", log.LstdFlags)
	}

	return &Runner{
		sources: &sources.Runner{
			Client:      client,
			Geocoder:    geocoder,
			AirNowKey:   opts.Configuration.AirNowAPIKey,
			MOENVAPIKey: opts.Configuration.MOENVAPIKey,
			Logger:      logger,
		},
	}
}

// SourceNames returns the stable source names accepted by Runner.ScrapeSource
// and Runner.ScrapeSources.
func SourceNames() []string {
	allSources := sources.All()
	names := make([]string, 0, len(allSources))
	for _, src := range allSources {
		names = append(names, src.Name)
	}

	return names
}

// Scrape runs all registered sources and returns their combined city records.
//
// Source-level failures are joined and returned with any successful records.
func (r *Runner) Scrape(ctx context.Context) ([]City, error) {
	results := r.ScrapeSources(ctx, nil)
	cities := make([]City, 0)
	errs := make([]error, 0)

	for _, result := range results {
		cities = append(cities, result.Cities...)
		if result.Err != nil {
			errs = append(errs, fmt.Errorf("%s: %w", result.Name, result.Err))
		}
	}

	return cities, errors.Join(errs...)
}

// ScrapeSource runs one named source.
func (r *Runner) ScrapeSource(ctx context.Context, name string) ([]City, error) {
	for _, src := range sources.All() {
		if src.Name == name {
			return src.Scrape(ctx, r.sources)
		}
	}

	return nil, fmt.Errorf("unknown source %q", name)
}

// ScrapeSources runs selected sources in registry order.
//
// Passing nil or an empty slice runs every source. Unknown names are returned as
// SourceResult errors so callers can handle partial success consistently.
func (r *Runner) ScrapeSources(ctx context.Context, names []string) []SourceResult {
	selected := make(map[string]struct{}, len(names))
	for _, name := range names {
		selected[name] = struct{}{}
	}

	allSources := sources.All()
	results := make([]SourceResult, 0, len(allSources))
	for _, src := range allSources {
		if len(selected) > 0 {
			if _, ok := selected[src.Name]; !ok {
				continue
			}
			delete(selected, src.Name)
		}

		cities, err := src.Scrape(ctx, r.sources)
		results = append(results, SourceResult{
			Name:   src.Name,
			Cities: cities,
			Err:    err,
		})
	}

	for name := range selected {
		results = append(results, SourceResult{
			Name: name,
			Err:  fmt.Errorf("unknown source %q", name),
		})
	}

	return results
}
