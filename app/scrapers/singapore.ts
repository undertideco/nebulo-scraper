import { capitalize, keyBy } from 'lodash';
import fetch from 'node-fetch';

import { SINGAPORE_URL } from '../constants/urls';
import { City } from '../db/models';

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

export const scrape = async (): Promise<City[]> => {
  const result = await fetch(SINGAPORE_URL);
  const resp: Response = await result.json();

  const locations = keyBy(resp.region_metadata, (rm) => rm.name);

  const { psi_twenty_four_hourly } = resp.items[0].readings;
  return Object.keys(psi_twenty_four_hourly).map((region) => ({
    name: `${capitalize(locations[region].name)}, Singapore`,
    data: psi_twenty_four_hourly[region],
    location: {
      lat: locations[region].label_location.latitude,
      lng: locations[region].label_location.longitude,
    },
  }));
};
