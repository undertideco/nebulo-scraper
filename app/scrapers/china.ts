import Bluebird from 'bluebird';
import fetch from 'node-fetch';

import { CHINA_URL } from '../constants/urls';
import { City } from '../db/models';
import { getLatLng } from '../helpers/geocoder';

interface Response {
  airList: {
    PM25: string;
    PM10: string;
    o3: string;
    AQI: string;
    SO2: string;
    NO2: string;
    CO: string;
    CITYNAME: string;
    airCity: {
      CITY_NAME: string;
      EN_CITY_NAME: string;
    };
  }[];
}

export const scrape = async (): Promise<City[]> => {
  const result = await fetch(CHINA_URL);
  const resp: Response = await result.json();
  const cities = resp.airList.map((city) => ({
    name: city.CITYNAME,
    data: parseInt(city.PM25, 10) || 0,
  }));

  return Bluebird.map(
    cities,
    async (city) => {
      const location = await getLatLng(city.name);
      return { ...city, location };
    },
    { concurrency: 2 }
  );
};
