# nebulo-scraper

[![Test Run](https://github.com/undertideco/nebulo-scraper/actions/workflows/test-run.yml/badge.svg)](https://github.com/undertideco/nebulo-scraper/actions/workflows/test-run.yml)

This is the web scraper our app [Nebulo](https://nebulo.undertide.co) uses to scrape air quality data.

It's built to run off Heroku with a scheduled task `npm start`.

It's perhaps the most lo-fi setup ever.

## Usage
Run `npm install` and then `npm start`, which will create a bunch of JSON files in the `output/` directory.

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
2. Run `npm install`
3. Copy `.env.example` to `.env` and populate the values

## Questions?
Feel free to create an issue.

## License
MIT
