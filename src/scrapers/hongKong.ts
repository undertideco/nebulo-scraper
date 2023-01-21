import axios from 'axios';
import Bluebird from 'bluebird';
import { uniqBy } from 'lodash';
import { Parser } from 'xml2js';

import { USER_AGENT } from '../constants/userAgent';
import { getLatLng } from '../helpers/geocoder';

const HONGKONG_URL = 'http://www.aqhi.gov.hk/epd/ddata/html/out/24pc_Eng.xml';

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
export default async function hongKong(): Promise<App.City[]> {
  const result = await axios.get<string>(HONGKONG_URL, {
    headers: {
      'User-Agent': USER_AGENT,
    },
  });
  // @ts-ignore
  const resp: Response = (await parseStringPromise(result.data)) as Response;
  const citiesRaw = resp.AQHI24HrPollutantConcentration.PollutantConcentration;
  citiesRaw.reverse(); // For latest value to be first

  const cities = uniqBy(citiesRaw, (city) => city.StationName);

  return Bluebird.map(
    cities,
    async (city): Promise<App.City> => {
      const location = await getLatLng(`${city.StationName}, Hong Kong`);
      return {
        name: city.StationName,
        data: city['PM2.5'] === '-' ? 0 : Math.round(parseFloat(city['PM2.5'])),
        region: 'Hong Kong',
        location,
      };
    },
    { concurrency: 2 }
  );
}
