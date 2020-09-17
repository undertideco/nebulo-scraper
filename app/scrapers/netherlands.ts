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
  while (true) {
    const result = await fetch(NETHERLANDS_STATIONS_URL);
    const json: Response<Station[]> = await result.json();

    stations.push(...json.data);
    if (
      json.pagination.current_page === json.pagination.last_page ||
      json.data.length === 0
    ) {
      break;
    }
  }

  const result = await fetch(NETHERLANDS_MEASUREMENTS_URL);
  const resp: Response<Measurement[]> = await result.json();

  const cities = resp.data.map((measurement) => ({
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
