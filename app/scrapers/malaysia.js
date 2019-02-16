const fetch = require('node-fetch');
const Promise = require('bluebird');
const geocoder = require('../helpers/geocoder');
const urls = require('../constants/urls');

const numberRegex = /(\d+)/;

module.exports = {
  scrape: async () => {
    const json = await fetch(urls.MALAYSIA_URL)
      .then(response => response.json());

    const cities = json['24hour_api'];
    cities.shift();

    const citiesProcessed = cities.map((city) => {
      const obj = {
        name: `${city[1]}, ${city[0].charAt(0) + city[0].substring(1).toLowerCase()}`,
        data: 0,
      };

      const data = city.slice(-1)[0];

      if (numberRegex.test(data)) {
        obj.data = parseInt(data.match(numberRegex)[0], 10);
      }

      return obj;
    });

    return Promise.map(
      citiesProcessed,
      city => geocoder.getLatLng(city.name)
        .then(location => Object.assign(city, { location })),
      { concurrency: 2 },
    );
  },
};
