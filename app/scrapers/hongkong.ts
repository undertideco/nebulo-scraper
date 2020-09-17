import Bluebird from 'bluebird';
import fetch from 'node-fetch';
import{parseStringPromise} from 'xml2js';

import { HONGKONG_URL } from '../constants/urls';
import {City} from '../db/models';
import { getLatLng } from '../helpers/geocoder';

interface Response {
  AQHI24HrPollutantConcentration: {
    PollutantConcentration: {
      StationName: string;
      DateTime: string;
      NO2: string | '-';
      O3: string | '-';
      PM10: string | '-';
      'PM2.5': string | '-';
    }[];
  };
}

export const scrape = async (): Promise<City[]> => {
    const result = await fetch(HONGKONG_URL);
    const text = await result.text();
    const resp: Response = await parseStringPromise(text, { explicitArray: false, mergeAttrs: true });
    const citiesRaw = resp.AQHI24HrPollutantConcentration.PollutantConcentration;
    const cities = citiesRaw.map((city) => ({
      name: city.StationName[0],
      data:
        city['PM2.5'] === '-' ? 0 : Math.round(parseFloat(city['PM2.5'])),
    }));

    return Bluebird.map(
      cities,
      async (city) => {
        const location = await getLatLng(`${city.name}, Hong Kong`);
        return { ...city, location };
      },
      { concurrency: 2 }
    );
  },
};
