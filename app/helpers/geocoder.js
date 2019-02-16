const fetch = require('node-fetch');
const redis = require('redis');
const { promisify } = require('util');

const redisOpts = {};

if (process.env.REDIS_URL) {
  redisOpts.url = process.env.REDIS_URL;
}

const redisClient = redis.createClient(redisOpts);
const existsAsync = promisify(redisClient.exists).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const hgetallAsync = promisify(redisClient.hgetall).bind(redisClient);
const hsetAsync = promisify(redisClient.hset).bind(redisClient);

const { GOOGLE_GEOCODING_API_KEY } = process.env;

const makeParamsQueryString = params => Object.keys(params)
  .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
  .join('&');

module.exports = {
  getLatLng: async (cityName) => {
    if (await existsAsync(cityName) === 1) {
      const cachedResults = await hgetallAsync(cityName);
      cachedResults.lat = Number(cachedResults.lat);
      cachedResults.lng = Number(cachedResults.lng);
      return cachedResults;
    }

    const params = {
      address: cityName,
      key: GOOGLE_GEOCODING_API_KEY,
    };

    const freshResult = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${makeParamsQueryString(params)}`)
      .then(res => res.json());
    if (!freshResult.status || freshResult.status !== 'OK') {
      console.log(freshResult);
      throw new Error('Google API status not ok');
    }
    const { lat, lng } = freshResult.results[0].geometry.location;
    await hsetAsync(cityName, 'lat', lat, 'lng', lng);
    return { lat, lng };
  },

  getAddress: async (lat, lng) => {
    const redisKey = `${lat},${lng}`;
    if (await existsAsync(redisKey) === 1) {
      const cachedResult = await getAsync(redisKey);
      return cachedResult;
    }

    const params = {
      latlng: `${lat},${lng}`,
      key: GOOGLE_GEOCODING_API_KEY,
    };

    const freshResult = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${makeParamsQueryString(params)}`)
      .then(res => res.json());
    if (!freshResult.status || freshResult.status !== 'OK') {
      console.log(freshResult);
      throw new Error('Google API status not ok');
    }
    const finalResult = freshResult.results[0].address_components
      .filter(component => component.types.includes('route') ||
        component.types.includes('sublocality') ||
        component.types.includes('locality'))
      .map(component => component.short_name)
      .join(', ');
    await setAsync(redisKey, finalResult);
    return finalResult;
  },
};
