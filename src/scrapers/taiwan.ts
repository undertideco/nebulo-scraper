import axios from 'axios';
import Bluebird from 'bluebird';

import { USER_AGENT } from '../constants/userAgent';
import { getLatLng } from '../helpers/geocoder';

const TAIWAN_URL =
  'https://data.epa.gov.tw/api/v2/aqx_p_488?api_key=e8dd42e6-9b8b-43f8-991e-b3dee723a52d&limit=1000&sort=datacreationdate%20desc&format=JSON';

const geocoderExceptions: Record<string, string> = {
  '安南, 臺南市': '安南',
};

type Response = {
  sitename: string;
  county: string;
  aqi: string;
  pollutant: string;
  status: string;
  so2: string;
  co: string;
  co_8hr: string;
  o3: string;
  o3_8hr: string;
  pm10: string;
  'pm2.5': string;
  no2: string;
  nox: string;
  no: string;
  windspeed: string;
  winddirec: string;
  publishtime: string;
  'pm2.5_avg': string;
  pm10_avg: string;
  so2_avg: string;
  longitude: string;
  latitude: string;
  siteid: string;
}[];

export default async function taiwan(): Promise<App.City[]> {
  const result = await axios.get<Response>(TAIWAN_URL, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    },
  });

  return Bluebird.map(
    result.data,
    async (city): Promise<App.City> => {
      const name = `${city.sitename}, ${city.county}`;
      const data = parseInt(city['pm2.5'], 10) || 0;

      const location = await getLatLng(geocoderExceptions[name] ?? name);

      return { name, data, region: 'Taiwan', location };
    },
    { concurrency: 2 }
  );
}
