const fetch = require('node-fetch');
const Promise = require('bluebird');
const urls = require('../constants/urls');
const geocoder = require('../helpers/geocoder');

module.exports = {
  scrape: async () => {
    const json = await fetch(urls.CHINA_URL)
      .then(response => response.json());
    const cities = json.airList.map(city => ({
      name: city.CITYNAME,
      data: parseInt(city.PM25, 10) || 0,
    }));
    return Promise.map(
      cities,
      city => geocoder.getLatLng(city.name)
        .then(location => Object.assign(city, { location })),
      { concurrency: 2 },
    );
  },
};
