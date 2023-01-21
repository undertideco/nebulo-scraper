import axios from 'axios';
import Bluebird from 'bluebird';

import { USER_AGENT } from '../constants/userAgent';
import { getLatLng } from '../helpers/geocoder';

const NETHERLANDS_STATIONS_URL =
  'https://api.luchtmeetnet.nl/open_api/stations';
const NETHERLANDS_MEASUREMENTS_URL =
  'https://api.luchtmeetnet.nl/open_api/measurements';

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

export default async function netherlands(): Promise<App.City[]> {
  const stations: Station[] = [];

  // Fetch all stations
  let stationsPage = 1;

  while (true) {
    const result = await axios.get<Response<Station[]>>(
      `${NETHERLANDS_STATIONS_URL}?page=${stationsPage}`,
      {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
      }
    );

    stations.push(...result.data.data);
    stationsPage = result.data.pagination.next_page;
    if (
      result.data.pagination.current_page ===
        result.data.pagination.last_page ||
      result.data.data.length === 0
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
    const result = await axios.get<Response<Measurement[]>>(
      `${NETHERLANDS_MEASUREMENTS_URL}?page=${measurementsPage}&formula=PM25&start=${oneHourAgoISOString}&end=${new Date().toISOString()}`,
      {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
      }
    );

    measurements.push(...result.data.data);
    measurementsPage = result.data.pagination.next_page;
    if (
      result.data.pagination.current_page ===
        result.data.pagination.last_page ||
      result.data.data.length === 0
    ) {
      break;
    }
  }

  return Bluebird.map(
    measurements,
    async (measurement): Promise<App.City> => {
      const name =
        stations.find((stn) => stn.number === measurement.station_number)
          ?.location ?? '';
      const data = Math.round(measurement.value);
      const location = await getLatLng(name);

      return { name, data, region: 'Netherlands', location };
    },
    { concurrency: 2 }
  );
}
