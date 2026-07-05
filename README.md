# nebulo-scraper

[![Test Run](https://github.com/undertideco/nebulo-scraper/actions/workflows/test-run.yml/badge.svg)](https://github.com/undertideco/nebulo-scraper/actions/workflows/test-run.yml)

This is the web scraper our app [Nebulo](https://nebulo.undertide.co) uses to scrape air quality data.

It is written in Go and can be used either as a CLI or as a package from another Go application.

## CLI Usage

Populate the required environment variables:

```sh
cp .env.example .env
```

Run all scrapers:

```sh
go run ./cmd/nebulo-scraper
```

Run one scraper:

```sh
go run ./cmd/nebulo-scraper -source singapore
```

The CLI writes JSON files into `output/` by default. Use `-output <dir>` to choose a different destination. Google geocoding results are cached in a temp JSON file by default; use `-geocode-cache <path>` to choose a different cache file, or `-geocode-cache ""` for an in-memory cache.

## Package Usage

```go
package main

import (
	"context"
	"log"

	scraper "github.com/undertideco/nebulo-scraper"
)

func main() {
	config, err := scraper.LoadConfiguration(context.Background())
	if err != nil {
		log.Fatal(err)
	}

cache := scraper.NewMemoryGeocodeCache()
runner := scraper.New(scraper.Options{
	Configuration: config,
	GeocodeCache:  cache,
})

	cities, err := runner.Scrape(context.Background())
	if err != nil {
		log.Fatal(err)
	}

log.Println(len(cities))
}
```

Consumers that want Redis, SQLite, or another cache can implement `scraper.GeocodeCache` and pass it through `scraper.Options.GeocodeCache`.

### Output

Each scraper writes its results to `output/<scraper>.json`. All results are also combined into `output/_all.json`.

`_all.json` is a JSON array of city objects with the following shape:

```json
[
  {
    "name": "string — city or station name",
    "region": "string — country or region identifier",
    "location": {
      "lat": "number — latitude",
      "lng": "number — longitude"
    },
    "data": "number — AQI (Air Quality Index) reading"
  }
]
```

### Development
1. Clone the repo
2. Copy `.env.example` to `.env` and populate the values
3. Run `go test ./...`

## Questions?
Feel free to create an issue.

## License
MIT
