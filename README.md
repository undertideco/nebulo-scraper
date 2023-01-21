# nebulo-scraper

[![Test Run](https://github.com/undertideco/nebulo-scraper/actions/workflows/test-run.yml/badge.svg)](https://github.com/undertideco/nebulo-scraper/actions/workflows/test-run.yml)

This is the web scraper our app [Nebulo](https://nebulo.undertide.co) uses to scrape air quality data.

It's built to run off Heroku with a scheduled task `yarn start`.

It's perhaps the most lo-fi setup ever.

## Usage
Run `yarn start`, which will create a bunch of JSON files in the `output/` directory.

### Development
1. Clone the repo
2. Copy `.env.example` to `.env` and populate the values

## Questions?
Feel free to create an issue.

## License
MIT
