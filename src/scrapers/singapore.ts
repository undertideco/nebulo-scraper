import axios from 'axios';
import { capitalize, keyBy } from 'lodash';

import { USER_AGENT } from '../constants/userAgent';

const SINGAPORE_URL = 'https://api.data.gov.sg/v1/environment/psi';

/* eslint-disable camelcase */
interface Response {
  region_metadata: {
    name: string;
    label_location: {
      latitude: number;
      longitude: number;
    };
  }[];
  items: {
    timestamp: string;
    update_timestamp: string;
    readings: {
      o3_sub_index: { [region: string]: number };
      pm10_twenty_four_hourly: { [region: string]: number };
      pm10_sub_index: { [region: string]: number };
      co_sub_index: { [region: string]: number };
      pm25_twenty_four_hourly: { [region: string]: number };
      so2_sub_index: { [region: string]: number };
      co_eight_hour_max: { [region: string]: number };
      no2_one_hour_max: { [region: string]: number };
      so2_twenty_four_hourly: { [region: string]: number };
      pm25_sub_index: { [region: string]: number };
      psi_twenty_four_hourly: { [region: string]: number };
      o3_eight_hour_max: { [region: string]: number };
    };
  }[];
}

export default async function singapore(): Promise<App.City[]> {
  const result = await axios.get<Response>(SINGAPORE_URL, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    },
  });

  const locations = keyBy(result.data.region_metadata, (rm) => rm.name);

  const { psi_twenty_four_hourly } = result.data.items[0].readings;

  const results: App.City[] = [];

  for (const region of Object.keys(psi_twenty_four_hourly)) {
    const city: App.City = {
      name: `${capitalize(locations[region].name)}, Singapore`,
      data: psi_twenty_four_hourly[region],
      location: {
        lat: locations[region].label_location.latitude,
        lng: locations[region].label_location.longitude,
      },
      region: 'Singapore',
    };

    results.push(city);
  }

  return results;
}
