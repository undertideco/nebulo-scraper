# nebulo-scraper

This is the web scraper our app [Nebulo](https://nebulo.undertide.co) uses to scrape air quality data for Singapore,
Malaysia, Taiwan, and Hong Kong.

It's built to run off Heroku with a scheduled task `node
bin/hurricane.js`

It's perhaps the most lo-fi setup ever.

## Usage
Literally. Don't. Feel free to use the scripts in [`app/scrapers`](https://github.com/undertideco/nebulo-scraper/tree/master/app/scrapers) and forget the rest.

### Development
Requirements:
- PostgreSQL 9.x running locally

1. Update credentials in `config.json`. If you are using Homebrew's Postgres on macOS, you want to use your own username and an empty password.
2. Run this in a terminal: `createdb nebulo_dev`.
3. Run `yarn db:setup`.

#### Reset DB
Run `yarn db:reset`

## Questions?
Feel free to create an issue or @ me [@jurvistan](https://twitter.com/jurvistan/)

## License
MIT
