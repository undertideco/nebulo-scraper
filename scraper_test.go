package scraper

import (
	"context"
	"path/filepath"
	"testing"
)

func TestLoadConfiguration(t *testing.T) {
	t.Setenv("GOOGLE_GEOCODING_API_KEY", "google-key")
	t.Setenv("AIRNOW_KEY", "airnow-key")
	t.Setenv("MOENV_API_KEY", "moenv-key")

	config, err := LoadConfiguration(context.Background())
	if err != nil {
		t.Fatalf("LoadConfiguration() error = %v", err)
	}
	if config.GoogleGeocodingAPIKey != "google-key" {
		t.Fatalf("GoogleGeocodingAPIKey = %q, want google-key", config.GoogleGeocodingAPIKey)
	}
	if config.AirNowAPIKey != "airnow-key" {
		t.Fatalf("AirNowAPIKey = %q, want airnow-key", config.AirNowAPIKey)
	}
	if config.MOENVAPIKey != "moenv-key" {
		t.Fatalf("MOENVAPIKey = %q, want moenv-key", config.MOENVAPIKey)
	}
}

func TestSourceNames(t *testing.T) {
	want := []string{"china", "hongKong", "macau", "malaysia", "netherlands", "singapore", "taiwan", "usa"}
	got := SourceNames()

	if len(got) != len(want) {
		t.Fatalf("SourceNames() length = %d, want %d", len(got), len(want))
	}
	for idx := range want {
		if got[idx] != want[idx] {
			t.Fatalf("SourceNames()[%d] = %q, want %q", idx, got[idx], want[idx])
		}
	}
}

func TestScrapeSourceUnknown(t *testing.T) {
	runner := New(Options{})

	_, err := runner.ScrapeSource(context.Background(), "missing")
	if err == nil {
		t.Fatal("ScrapeSource() error = nil, want error")
	}
}

func TestScrapeSourcesUnknown(t *testing.T) {
	runner := New(Options{})

	results := runner.ScrapeSources(context.Background(), []string{"missing"})
	if len(results) != 1 {
		t.Fatalf("ScrapeSources() returned %d results, want 1", len(results))
	}
	if results[0].Name != "missing" {
		t.Fatalf("ScrapeSources()[0].Name = %q, want missing", results[0].Name)
	}
	if results[0].Err == nil {
		t.Fatal("ScrapeSources()[0].Err = nil, want error")
	}
}

func TestMemoryGeocodeCache(t *testing.T) {
	ctx := context.Background()
	cache := NewMemoryGeocodeCache()
	location := Location{Lat: 1.25, Lng: 103.75}

	if err := cache.SetLocation(ctx, "Singapore", location); err != nil {
		t.Fatalf("SetLocation() error = %v", err)
	}
	gotLocation, ok, err := cache.GetLocation(ctx, "Singapore")
	if err != nil {
		t.Fatalf("GetLocation() error = %v", err)
	}
	if !ok {
		t.Fatal("GetLocation() ok = false, want true")
	}
	if gotLocation != location {
		t.Fatalf("GetLocation() = %#v, want %#v", gotLocation, location)
	}

	if err := cache.SetAddress(ctx, 1.25, 103.75, "Singapore"); err != nil {
		t.Fatalf("SetAddress() error = %v", err)
	}
	address, ok, err := cache.GetAddress(ctx, 1.25, 103.75)
	if err != nil {
		t.Fatalf("GetAddress() error = %v", err)
	}
	if !ok {
		t.Fatal("GetAddress() ok = false, want true")
	}
	if address != "Singapore" {
		t.Fatalf("GetAddress() = %q, want Singapore", address)
	}
}

func TestJSONFileGeocodeCachePersists(t *testing.T) {
	ctx := context.Background()
	path := filepath.Join(t.TempDir(), "geocode-cache.json")
	location := Location{Lat: 22.3, Lng: 114.2}

	cache, err := NewJSONFileGeocodeCache(path)
	if err != nil {
		t.Fatalf("NewJSONFileGeocodeCache() error = %v", err)
	}
	if err := cache.SetLocation(ctx, "Hong Kong", location); err != nil {
		t.Fatalf("SetLocation() error = %v", err)
	}
	if err := cache.SetAddress(ctx, 22.3, 114.2, "Hong Kong"); err != nil {
		t.Fatalf("SetAddress() error = %v", err)
	}

	reloaded, err := NewJSONFileGeocodeCache(path)
	if err != nil {
		t.Fatalf("NewJSONFileGeocodeCache() reload error = %v", err)
	}

	gotLocation, ok, err := reloaded.GetLocation(ctx, "Hong Kong")
	if err != nil {
		t.Fatalf("GetLocation() error = %v", err)
	}
	if !ok {
		t.Fatal("GetLocation() ok = false, want true")
	}
	if gotLocation != location {
		t.Fatalf("GetLocation() = %#v, want %#v", gotLocation, location)
	}

	address, ok, err := reloaded.GetAddress(ctx, 22.3, 114.2)
	if err != nil {
		t.Fatalf("GetAddress() error = %v", err)
	}
	if !ok {
		t.Fatal("GetAddress() ok = false, want true")
	}
	if address != "Hong Kong" {
		t.Fatalf("GetAddress() = %q, want Hong Kong", address)
	}
}
