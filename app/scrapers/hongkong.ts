import Bluebird from 'bluebird';
import { uniqBy } from 'lodash';
import fetch from 'node-fetch';
import { Parser } from 'xml2js';

import { HONGKONG_URL } from '../constants/urls';
import { City } from '../db/models';
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

const parser = new Parser({
  explicitArray: false,
  mergeAttrs: true,
});
const parseStringPromise = Bluebird.promisify(parser.parseString, {
  context: parser,
});

export const scrape = async (): Promise<City[]> => {
  const result = await fetch(HONGKONG_URL);
  const text = await result.text();
  const resp: Response = (await parseStringPromise(text)) as Response;
  const citiesRaw = resp.AQHI24HrPollutantConcentration.PollutantConcentration;
  citiesRaw.reverse(); // For latest value to be first
  const cities = uniqBy(citiesRaw, (city) => city.StationName).map((city) => ({
    name: city.StationName,
    data: city['PM2.5'] === '-' ? 0 : Math.round(parseFloat(city['PM2.5'])),
  }));

  return Bluebird.map(
    cities,
    async (city) => {
      const location = await getLatLng(`${city.name}, Hong Kong`);
      return { ...city, location };
    },
    { concurrency: 2 }
  );
};
