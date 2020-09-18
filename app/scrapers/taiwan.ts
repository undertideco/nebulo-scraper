import Bluebird from 'bluebird';
import fetch from 'node-fetch';

import { TAIWAN_URL } from '../constants/urls';
import { City } from '../db/models';
import { getLatLng } from '../helpers/geocoder';

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

export const scrape = async (): Promise<City[]> => {
  const result = await fetch(TAIWAN_URL);
  const resp: Response = await result.json();
  const cities = resp.map((city) => ({
    name: `${city.SiteName}, ${city.County}`,
    data: parseInt(city['PM2.5'], 10) || 0,
  }));
  return Bluebird.map(
    cities,
    async (city) => {
      const location = await getLatLng(
        geocoderExceptions[city.name] ?? city.name
      );
      return { ...city, location };
    },
    { concurrency: 2 }
  );
};
