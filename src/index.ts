import { config } from 'dotenv';
import * as fs from 'fs';

import china from './scrapers/china';
import hongKong from './scrapers/hongKong';
import macau from './scrapers/macau';
import malaysia from './scrapers/malaysia';
import netherlands from './scrapers/netherlands';
import singapore from './scrapers/singapore';
import taiwan from './scrapers/taiwan';
import usa from './scrapers/usa';

config();

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

  for (const scraperFunction of SCRAPER_FUNCTIONS) {
    console.log(`[SCRAPE] Starting work on ${scraperFunction.name}`);

    try {
      const cities = await scraperFunction();
      console.log(`Scraped ${cities.length} for ${scraperFunction.name}`);

      fs.writeFileSync(
        `output/${scraperFunction.name}`,
        JSON.stringify(cities)
      );
    } catch (e) {
      console.error(e);
    }
  }
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
