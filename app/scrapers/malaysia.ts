import Bluebird from 'bluebird';
import fetch from 'node-fetch';

import { MALAYSIA_URL } from '../constants/urls';
import { City } from '../db/models';
import { getLatLng } from '../helpers/geocoder';

const numberRegex = /(\d+)/;

interface Response {
  '24hour_api': string[][];
}

export const scrape = async (): Promise<City[]> => {
  const result = await fetch(MALAYSIA_URL);
  const resp: Response = await result.json();

  const cities = resp['24hour_api'];
  cities.shift(); // Discard header

  const citiesProcessed = cities.map((city) => {
    const obj = {
      name: `${city[1]}, ${
        city[0].charAt(0) + city[0].substring(1).toLowerCase()
      }`,
      data: 0,
    };

    const data = city.slice(-1)[0];

    if (numberRegex.test(data)) {
      obj.data = parseInt(data.match(numberRegex)?.[0] ?? '0', 10);
    }

    return obj;
  });

  return Bluebird.map(
    citiesProcessed,
    async (city) => {
      const location = await getLatLng(city.name);
      return { ...city, location };
    },
    { concurrency: 2 }
  );
};
