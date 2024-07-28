import axios from 'axios';
import Bluebird from 'bluebird';

import { USER_AGENT } from '../constants/userAgent';
import { getLatLng } from '../helpers/geocoder';

const CHINA_URL = 'http://www.cnemc.cn/getIndexData.do';

interface CityDataPoint {
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
}

interface Response {
  airList: CityDataPoint[];
}

const geocoderExceptions: Record<string, string> = {
  玉树州: 'Yushu, China',
};

export default async function china(): Promise<App.City[]> {
  const result = await axios.get<Response>(CHINA_URL, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    },
  });

  console.log('Scraped', result.data.airList.length, 'for China');

  return Bluebird.map(
    result.data.airList,
    async (cityDataPoint): Promise<App.City> => {
      let location: App.City['location'] = {
        lat: 0,
        lng: 0,
      };

      try {
        location = await getLatLng(
          geocoderExceptions[cityDataPoint.CITYNAME] ?? cityDataPoint.CITYNAME
        );
      } catch (e) {
        console.error(e);
        console.log('Using dummy location for', cityDataPoint.CITYNAME);
      }

      return {
        name: cityDataPoint.CITYNAME,
        region: 'China',
        data: parseInt(cityDataPoint.PM25, 10) || 0,
        location,
      };
    },
    { concurrency: 2 }
  );
}
