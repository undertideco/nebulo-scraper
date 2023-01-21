import Redis from 'ioredis';
import fetch from 'node-fetch';

const { REDIS_URL, GOOGLE_GEOCODING_API_KEY } = process.env;

const makeParamsQueryString = (params: { [key: string]: any }) =>
  Object.keys(params)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');

export const getLatLng = async (
  cityName: string
): Promise<{ lat: number; lng: number }> => {
  const redisClient = new Redis(REDIS_URL);
  if ((await redisClient.exists(cityName)) === 1) {
    const cachedResults = await redisClient.hgetall(cityName);
    redisClient.quit();
    return {
      lat: Number(cachedResults.lat),
      lng: Number(cachedResults.lng),
    };
  }

  const params = {
    address: cityName,
    key: GOOGLE_GEOCODING_API_KEY,
  };

  const freshResult = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?${makeParamsQueryString(
      params
    )}`
  ).then((res) => res.json());
  if (!freshResult.status || freshResult.status !== 'OK') {
    console.log('Error getting coordinates for', cityName, freshResult);
    redisClient.quit();
    throw new Error('Google API status not ok');
  }
  const { lat, lng } = freshResult.results[0].geometry.location;
  await redisClient.hmset(cityName, 'lat', lat, 'lng', lng);
  redisClient.quit();
  return { lat, lng };
};

interface GeocodeResponse {
  status: string;
  results: {
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
  }[];
}

export const getAddress = async (lat: number, lng: number): Promise<string> => {
  const redisClient = new Redis(REDIS_URL);
  const redisKey = `${lat},${lng}`;
  const cachedResult = await redisClient.get(redisKey);
  if (cachedResult !== null) {
    redisClient.quit();
    return cachedResult;
  }

  const params = {
    latlng: `${lat},${lng}`,
    key: GOOGLE_GEOCODING_API_KEY,
  };

  const freshResult: GeocodeResponse = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?${makeParamsQueryString(
      params
    )}`
  ).then((res) => res.json());

  if (!freshResult.status || freshResult.status !== 'OK') {
    console.log(freshResult);
    redisClient.quit();
    throw new Error('Google API status not ok');
  }
  const finalResult = freshResult.results[0].address_components
    .filter(
      (component) =>
        component.types.includes('route') ||
        component.types.includes('sublocality') ||
        component.types.includes('locality')
    )
    .map((component) => component.short_name)
    .join(', ');
  await redisClient.set(redisKey, finalResult);

  redisClient.quit();
  return finalResult;
};
