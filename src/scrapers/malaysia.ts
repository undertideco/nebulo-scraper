import axios from 'axios';
import Bluebird from 'bluebird';

import { USER_AGENT } from '../constants/userAgent';
import { getLatLng } from '../helpers/geocoder';

const MALAYSIA_URL =
  'https://apims.doe.gov.my/data/public_v2/CAQM/last24hours.json';

const numberRegex = /(\d+)/;

interface Response {
  '24hour_api_apims': string[][];
}

export default async function malaysia(): Promise<App.City[]> {
  const result = await axios.get<Response>(MALAYSIA_URL, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    },
  });

  const cities = result.data['24hour_api_apims'];
  cities.shift(); // Discard header

  return Bluebird.map(
    cities,
    async (city): Promise<App.City> => {
      const name = `${city[1]}, ${
        city[0].charAt(0) + city[0].substring(1).toLowerCase()
      }`;

      const dataRaw = city.slice(-1)[0];
      let data = 0;

      if (numberRegex.test(dataRaw)) {
        data = parseInt(dataRaw.match(numberRegex)?.[0] ?? '0', 10);
      }

      const location = await getLatLng(name);

      return { name, data, region: 'Malaysia', location };
    },
    { concurrency: 2 }
  );
}
