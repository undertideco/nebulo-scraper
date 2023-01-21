import axios from 'axios';
import Bluebird from 'bluebird';

import { USER_AGENT } from '../constants/userAgent';
import { getLatLng } from '../helpers/geocoder';

const TAIWAN_URL = 'http://opendata2.epa.gov.tw/AQI.json';

const geocoderExceptions: Record<string, string> = {
  '安南, 臺南市': '安南',
};

type Response = {
  SiteName: string;
  County: string;
  AQI: string;
  Pollutant: string;
  Status: string;
  SO2: string;
  CO: string;
  CO_8hr: string;
  O3: string;
  O3_8hr: string;
  PM10: string;
  'PM2.5': string;
  NO2: string;
  NOx: string;
  NO: string;
  WindSpeed: string;
  WindDirec: string;
  PublishTime: string;
  'PM2.5_AVG': string;
  PM10_AVG: string;
  SO2_AVG: string;
  Longitude: string;
  Latitude: string;
  SiteId: string;
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
      const name = `${city.SiteName}, ${city.County}`;
      const data = parseInt(city['PM2.5'], 10) || 0;

      const location = await getLatLng(geocoderExceptions[name] ?? name);

      return { name, data, region: 'Taiwan', location };
    },
    { concurrency: 2 }
  );
}
