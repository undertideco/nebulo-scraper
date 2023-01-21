import axios from 'axios';
import Redis from 'ioredis';

const { REDIS_URL, GOOGLE_GEOCODING_API_KEY } = process.env;

interface GeocodeResponse {
  status: string;
  results: {
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
}

export async function getLatLng(
  cityName: string
): Promise<{ lat: number; lng: number }> {
  if (GOOGLE_GEOCODING_API_KEY == null) {
    throw new Error('No Geocoding API key provided!');
  }

  if (REDIS_URL != null) {
    const redisClient = new Redis(REDIS_URL);

    const isCached = (await redisClient.exists(cityName)) === 1;

    if (isCached) {
      const cachedResults = await redisClient.hgetall(cityName);
      await redisClient.quit();

      return {
        lat: Number(cachedResults.lat),
        lng: Number(cachedResults.lng),
      };
    } else {
      await redisClient.quit();
    }
  }

  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  url.searchParams.set('address', cityName);
  url.searchParams.set('key', GOOGLE_GEOCODING_API_KEY);

  const freshResult = await axios.get<GeocodeResponse>(url.toString());

  if (freshResult.status !== 200) {
    console.log('Error getting coordinates for', cityName, freshResult);
    throw new Error('Google API status not ok');
  }

  const { lat, lng } = freshResult.data.results[0].geometry.location;

  if (REDIS_URL != null) {
    const redisClient = new Redis(REDIS_URL);

    await redisClient.hmset(cityName, 'lat', lat, 'lng', lng);
    await redisClient.quit();
  }
  return { lat, lng };
}

export async function getAddress(lat: number, lng: number): Promise<string> {
  if (GOOGLE_GEOCODING_API_KEY == null) {
    throw new Error('No Geocoding API key provided!');
  }

  const redisKey = `${lat},${lng}`;

  if (REDIS_URL != null) {
    const redisClient = new Redis(REDIS_URL);
    const cachedResult = await redisClient.get(redisKey);
    if (cachedResult !== null) {
      await redisClient.quit();
      return cachedResult;
    }
  }

  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  url.searchParams.set('latlng', `${lat},${lng}`);
  url.searchParams.set('key', GOOGLE_GEOCODING_API_KEY);

  const freshResult = await axios.get<GeocodeResponse>(url.toString());

  if (freshResult.status !== 200) {
    console.log(freshResult);
    throw new Error('Google API status not ok');
  }

  const finalResult = freshResult.data.results[0].address_components
    .filter(
      (component) =>
        component.types.includes('route') ||
        component.types.includes('sublocality') ||
        component.types.includes('locality')
    )
    .map((component) => component.short_name)
    .join(', ');

  if (REDIS_URL != null) {
    const redisClient = new Redis(REDIS_URL);

    await redisClient.set(redisKey, finalResult);
    await redisClient.quit();
  }
  return finalResult;
}
