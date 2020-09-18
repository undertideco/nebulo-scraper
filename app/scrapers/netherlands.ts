import Bluebird from 'bluebird';
import fetch from 'node-fetch';

import {
  NETHERLANDS_MEASUREMENTS_URL,
  NETHERLANDS_STATIONS_URL,
} from '../constants/urls';
import { City } from '../db/models';
import { getLatLng } from '../helpers/geocoder';

interface Station {
  number: string;
  location: string;
}

interface Measurement {
  station_number: string;
  value: number;
  timestamp_measured: string;
  formula: string;
}

interface Response<TData> {
  pagination: {
    last_page: number;
    first_page: number;
    prev_page: number;
    current_page: number;
    page_list: string[];
    next_page: number;
  };
  data: TData;
}

export const scrape = async (): Promise<City[]> => {
  const stations: Station[] = [];

  // Fetch all stations
  let stationsPage = 1;

  while (true) {
    const result = await fetch(
      `${NETHERLANDS_STATIONS_URL}?page=${stationsPage}`
    );
    const json: Response<Station[]> = await result.json();

    stations.push(...json.data);
    stationsPage = json.pagination.next_page;
    if (
      json.pagination.current_page === json.pagination.last_page ||
      json.data.length === 0
    ) {
      break;
    }
  }

  console.log('Netherlands: Retrieved', stations.length, 'stations');

  const measurements: Measurement[] = [];
  let measurementsPage = 1;

  const currentTimeEpoch = new Date().valueOf();
  const oneHourAgoEpoch = currentTimeEpoch - 3600000;
  const oneHourAgoISOString = new Date(oneHourAgoEpoch).toISOString();

  while (true) {
    const result = await fetch(
      `${NETHERLANDS_MEASUREMENTS_URL}?page=${measurementsPage}&formula=PM25&start=${oneHourAgoISOString}&end=${new Date().toISOString()}`
    );
    const resp: Response<Measurement[]> = await result.json();

    measurements.push(...resp.data);
    measurementsPage = resp.pagination.next_page;
    if (
      resp.pagination.current_page === resp.pagination.last_page ||
      resp.data.length === 0
    ) {
      break;
    }
  }

  const cities = measurements.map((measurement) => ({
    name:
      stations.find((stn) => stn.number === measurement.station_number)
        ?.location ?? '',
    data: Math.round(measurement.value),
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
