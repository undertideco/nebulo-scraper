const fetch = require('node-fetch');
const Promise = require('bluebird');
const urls = require('../constants/urls');
const geocoder = require('../helpers/geocoder');

module.exports = {
  scrape: async () => {
    const json = await fetch(urls.USA_URL)
      .then(response => response.json());
    const cities = json.map(city => ({
      name: null,
      data: parseInt(city.AQI, 10) || 0,
      location: {
        lat: city.Latitude,
        lng: city.Longitude,
      },
    }));
    return Promise.map(
      cities,
      city => geocoder.getAddress(city.location.lat, city.location.lng)
        .then(address => Object.assign(
          city,
          { name: address },
        )),
      { concurrency: 2 },
    );
  },
};
