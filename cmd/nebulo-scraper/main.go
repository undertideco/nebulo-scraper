package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	scraper "github.com/undertideco/nebulo-scraper"
	"github.com/undertideco/nebulo-scraper/internal/envfile"
)

type stringList []string

func (l *stringList) String() string {
	return strings.Join(*l, ",")
}

func (l *stringList) Set(value string) error {
	if value == "" {
		return nil
	}

	*l = append(*l, strings.Split(value, ",")...)
	return nil
}

func main() {
	var outputDir string
	var envPath string
	var geocodeCachePath string
	var sourceNames stringList
	var strict bool
	var listSources bool

	flag.StringVar(&outputDir, "output", "output", "directory to write JSON output into")
	flag.StringVar(&envPath, "env", ".env", "path to an env file to load before scraping")
	flag.StringVar(&geocodeCachePath, "geocode-cache", filepath.Join(os.TempDir(), "nebulo-scraper-geocode-cache.json"), "path to a JSON geocode cache file; set to empty to use an in-memory cache")
	flag.Var(&sourceNames, "source", "source name to scrape; can be repeated or comma-separated")
	flag.BoolVar(&strict, "strict", false, "exit non-zero if any selected source fails")
	flag.BoolVar(&listSources, "list-sources", false, "print available sources and exit")
	flag.Parse()

	if listSources {
		for _, name := range scraper.SourceNames() {
			fmt.Println(name)
		}
		return
	}

	logger := log.New(os.Stderr, "", log.LstdFlags)
	if err := envfile.Load(envPath); err != nil {
		logger.Fatalf("load env file: %v", err)
	}

	if err := os.MkdirAll(outputDir, 0755); err != nil {
		logger.Fatalf("create output directory: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Minute)
	defer cancel()

	config, err := scraper.LoadConfiguration(ctx)
	if err != nil {
		logger.Fatalf("load configuration: %v", err)
	}

	geocodeCache := scraper.GeocodeCache(scraper.NewMemoryGeocodeCache())
	if geocodeCachePath != "" {
		geocodeCache, err = scraper.NewJSONFileGeocodeCache(geocodeCachePath)
		if err != nil {
			logger.Fatalf("create geocode cache: %v", err)
		}
	}

	runner := scraper.New(scraper.Options{
		Configuration: config,
		GeocodeCache:  geocodeCache,
		Logger:        logger,
	})

	allCities := make([]scraper.City, 0)
	hadErrors := false
	selectedSources := []string(sourceNames)
	if len(selectedSources) == 0 {
		selectedSources = scraper.SourceNames()
	}

	for _, sourceName := range selectedSources {
		logger.Printf("[SCRAPE] Starting work on %s", sourceName)

		cities, err := runner.ScrapeSource(ctx, sourceName)
		if err != nil {
			hadErrors = true
			logger.Printf("[SCRAPE] %s failed: %v", sourceName, err)
			continue
		}

		allCities = append(allCities, cities...)
		logger.Printf("Scraped %d for %s", len(cities), sourceName)

		if err := writeJSON(filepath.Join(outputDir, sourceName+".json"), cities); err != nil {
			logger.Fatalf("write %s output: %v", sourceName, err)
		}
	}

	if err := writeJSON(filepath.Join(outputDir, "_all.json"), allCities); err != nil {
		logger.Fatalf("write combined output: %v", err)
	}

	if strict && hadErrors {
		os.Exit(1)
	}
}

func writeJSON(path string, value any) error {
	body, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return os.WriteFile(path, body, 0644)
}
