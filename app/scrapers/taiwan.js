const fetch = require('node-fetch');
const Promise = require('bluebird');
const urls = require('../constants/urls');
const geocoder = require('../helpers/geocoder');

const geocoderExceptions = {
  '安南, 臺南市': '安南',
};

module.exports = {
  scrape: async () => {
    const json = await fetch(urls.TAIWAN_URL)
      .then(response => response.json());
    const cities = json.map(city => ({
      name: `${city.SiteName}, ${city.County}`,
      data: parseInt(city['PM2.5'], 10) || 0,
    }));
    return Promise.map(
      cities,
      city => geocoder.getLatLng(geocoderExceptions[city.name] || city.name)
        .then(location => Object.assign(city, { location })),
      { concurrency: 2 },
    );
  },
};
