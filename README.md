# nebulo-scraper

This is the web scraper our app [Nebulo](https://nebulo.undertide.co) uses to scrape air quality data for Singapore,
Malaysia, Taiwan, and Hong Kong.

It's built to run off Heroku with a scheduled task `node
bin/hurricane.js`

It's perhaps the most lo-fi setup ever.

## Usage
Literally. Don't. Feel free to use the scripts in [`app/scrapers`](https://github.com/undertideco/nebulo-scraper/tree/master/app/scrapers) and forget the rest.

### Development
1. Clone the repo
2. Copy `.env.example` to `.env` and populate the values
3. Run `docker-compose up`. The `scraper` service will run once and terminate, which is expected (as this repo is a one-off script)

#### Reset DB
Run `yarn db:reset`

## Questions?
Feel free to create an issue or @ me [@jurvistan](https://twitter.com/jurvistan/)

## License
MIT
