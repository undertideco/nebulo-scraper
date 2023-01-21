import axios from 'axios';

import { USER_AGENT } from '../constants/userAgent';

const MACAU_URL =
  'https://cms.smg.gov.mo/uploads/sync/json/latestAirConcentration.json';

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

export default async function macau(): Promise<App.City[]> {
  const result = await axios.get<Response>(MACAU_URL, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    },
  });

  return Object.keys(locations).map((key) => {
    const city: App.City = {
      ...locations[key as StationKey],
      region: 'Macau',
      data: Math.round(
        parseFloat(result.data[key as StationKey].HE_PM2_5 ?? '0')
      ),
    };

    return city;
  });
}
