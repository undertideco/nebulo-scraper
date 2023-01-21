import axios from 'axios';
import Bluebird from 'bluebird';

import { USER_AGENT } from '../constants/userAgent';
import { getAddress } from '../helpers/geocoder';

const { AIRNOW_KEY } = process.env;

const USA_URL = `https://www.airnowapi.org/aq/data/?parameters=PM25&BBOX=-124.205070,28.716781,-75.337882,45.419415&dataType=A&format=application%2Fjson&verbose=0&API_KEY=${AIRNOW_KEY}`;

type Response = {
  Latitude: number;
  Longitude: number;
  UTC: string;
  Parameter: string;
  Unit: string;
  AQI: number;
  Category: number;
}[];

export default async function usa(): Promise<App.City[]> {
  const result = await axios.get<Response>(USA_URL, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    },
  });

  return Bluebird.map(
    result.data,
    async (city): Promise<App.City> => {
      const address = await getAddress(city.Latitude, city.Longitude);

      return {
        name: address,
        data: city.AQI,
        location: {
          lat: city.Latitude,
          lng: city.Longitude,
        },
        region: 'United States of America',
      };
    },
    { concurrency: 2 }
  );
}
