import axios from 'axios';

import { USER_AGENT } from '../constants/userAgent';

const MALAYSIA_URL =
  'https://eqms.doe.gov.my/api3/publicmapproxy/PUBLIC_DISPLAY/CAQM_MCAQM_Current_Reading/MapServer/0/query?f=json&outFields=*&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1';

interface Response {
  features: {
    attributes: {
      API: number;
      STATION_LOCATION: string;
      DATETIME: string;
      LONGITUDE: number;
      LATITUDE: number;
      STATE_ID: number;
      STATION_ID: string;
      PARAM_SYMBOL: string;
    };
  }[];
}

export default async function malaysia(): Promise<App.City[]> {
  const result = await axios.get<Response>(MALAYSIA_URL, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    },
  });

  return result.data.features.map((feature) => {
    return {
      name: feature.attributes.STATION_LOCATION,
      data: feature.attributes.API,
      region: 'Malaysia',
      location: {
        lat: feature.attributes.LATITUDE,
        lng: feature.attributes.LONGITUDE,
      },
    };
  });
}
