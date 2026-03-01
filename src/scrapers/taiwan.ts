import axios from 'axios';
import Bluebird from 'bluebird';
import { config } from 'dotenv';

import { USER_AGENT } from '../constants/userAgent';
import { getLatLng } from '../helpers/geocoder';

config();

const { MOENV_API_KEY } = process.env;

const TAIWAN_URL = new URL('https://data.moenv.gov.tw/api/v2/aqx_p_02');
TAIWAN_URL.searchParams.set('api_key', MOENV_API_KEY!);

const geocoderExceptions: Record<string, string> = {
  '安南, 臺南市': '安南',
};

interface PM25Record {
  site: string;
  county: string;
  pm25: string;
  datacreationdate: string;
  itemunit: string;
}

export default async function taiwan(): Promise<App.City[]> {
  const result = await axios.get<PM25Record[]>(TAIWAN_URL.toString(), {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    },
  });

  return Bluebird.map(
    result.data,
    async (city): Promise<App.City> => {
      const name = `${city.site}, ${city.county}`;
      const data = parseInt(city.pm25, 10) || 0;

      const location = await getLatLng(geocoderExceptions[name] ?? name);

      return { name, data, region: 'Taiwan', location };
    },
    { concurrency: 2 },
  );
}
