import { config } from 'dotenv';
config();

import * as fs from 'fs';

import china from './scrapers/china';
import hongKong from './scrapers/hongKong';
import macau from './scrapers/macau';
import malaysia from './scrapers/malaysia';
import netherlands from './scrapers/netherlands';
import singapore from './scrapers/singapore';
import taiwan from './scrapers/taiwan';
import usa from './scrapers/usa';

const { NODE_ENV } = process.env;

const isProduction = NODE_ENV === 'production';

const SCRAPER_FUNCTIONS = [
  china,
  hongKong,
  macau,
  malaysia,
  netherlands,
  singapore,
  taiwan,
  usa,
];

async function run() {
  try {
    fs.mkdirSync('output');
  } catch (e) {}

  const cities: App.City[] = [];

  for (const scraperFunction of SCRAPER_FUNCTIONS) {
    console.log(`[SCRAPE] Starting work on ${scraperFunction.name}`);

    try {
      const newCities = await scraperFunction();
      cities.push(...newCities);
      console.log(`Scraped ${newCities.length} for ${scraperFunction.name}`);

      fs.writeFileSync(
        `output/${scraperFunction.name}.json`,
        JSON.stringify(newCities),
      );
    } catch (e) {
      console.error(e);
    }
  }

  fs.writeFileSync('output/_all.json', JSON.stringify(cities));
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
