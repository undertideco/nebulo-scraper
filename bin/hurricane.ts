import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

import { dispatchCities, endPool } from '../app/db/middleware';

config();

const run = async () => {
  const scrapersDir = path.resolve(__dirname, '../app/scrapers');
  const scrapersDirFiles = fs
    .readdirSync(scrapersDir)
    .filter((file) => file.endsWith('.ts'));

  for (const scraperFile of scrapersDirFiles) {
    console.log(`[SCRAPE] Starting work on ${scraperFile}`);

    const { scrape } = await import(path.join(scrapersDir, scraperFile));

    try {
      const cities = await scrape();
      await dispatchCities(cities);
      console.log('Got', cities.length, 'cities');
    } catch (e) {
      console.error(e);
    }
  }
};

run()
  .then(() => endPool())
  .catch(console.error);
