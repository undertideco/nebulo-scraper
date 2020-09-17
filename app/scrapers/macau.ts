import fetch from 'node-fetch';

import { MACAU_URL } from '../constants/urls';
import { City } from '../db/models';

type StationKey =
  | 'enhopolu'
  | 'pohopolu'
  | 'tghopolu'
  | 'tchopolu'
  | 'cdhopolu'
  | 'khhopolu';

const locations: Record<
  StationKey,
  { location: { lat: number; lng: number }; name: string }
> = {
  enhopolu: {
    location: { lat: 22.213889, lng: 113.542778 },
    name: '澳門高密度住宅區',
  },
  pohopolu: {
    location: { lat: 22.195833, lng: 113.544722 },
    name: '澳門路邊站',
  },
  tghopolu: { location: { lat: 22.16, lng: 113.565 }, name: '氹仔一般性' },
  tchopolu: {
    location: { lat: 22.159574, lng: 113.554088 },
    name: '氹仔高密度住宅區',
  },
  cdhopolu: {
    location: { lat: 22.125278, lng: 113.554444 },
    name: '路環一般性',
  },
  khhopolu: {
    location: { lat: 22.13271, lng: 113.584168 },
    name: '九澳路邊站',
  },
};

interface Station {
  DDTT: string;
  HE_PM10: string | null;
  HE_PM2_5: string | null;
  HE_NO2: string;
  HE_CO: string;
  HE_O3?: string;
  HE_SO2?: string;
}

type Response = Record<StationKey, Station>;

export const scrape = async (): Promise<City[]> => {
  const result = await fetch(MACAU_URL);
  const resp: Response = await result.json();

  const cities: City[] = Object.keys(locations).map((key) => ({
    ...locations[key as StationKey],
    data: parseFloat(resp[key as StationKey].HE_PM2_5 ?? '0'),
  }));

  return cities;
};
