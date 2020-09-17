import Bluebird from 'bluebird';
import fetch from 'node-fetch';

import { USA_URL } from '../constants/urls';
import { City } from '../db/models';
import { getAddress } from '../helpers/geocoder';

type Response = {
  Latitude: number;
  Longitude: number;
  UTC: string;
  Parameter: string;
  Unit: string;
  AQI: number;
  Category: number;
}[];

export const scrape = async (): Promise<City[]> => {
  const result = await fetch(USA_URL);
  const resp: Response = await result.json();
  const cities = resp.map((city) => ({
    name: null,
    data: city.AQI,
    location: {
      lat: city.Latitude,
      lng: city.Longitude,
    },
  }));

  return Bluebird.map(
    cities,
    (city) =>
      getAddress(city.location.lat, city.location.lng).then((address) =>
        Object.assign(city, { name: address })
      ),
    { concurrency: 2 }
  );
};
