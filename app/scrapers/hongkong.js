const fetch = require('node-fetch');
const Promise = require('bluebird');
const urls = require('../constants/urls');
const geocoder = require('../helpers/geocoder');
const xml2js = require('xml2js');

const parseString = Promise.promisify(xml2js.parseString);

/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
/* eslint func-names: off */
Array.prototype.chunk = function (length) {
  const chunkarr = [];
  let i = 0;

  while (i < this.length) {
    chunkarr.push(this.slice(i, i += length));
  }

  return chunkarr;
};

Array.prototype.last = function () {
  return this.slice(-1)[0];
};

module.exports = {
  scrape: async () => {
    const xml = await fetch(urls.HONGKONG_URL)
      .then(response => response.text())
      .then(parseString);
    const citiesRaw = xml.AQHI24HrPollutantConcentration.PollutantConcentration
      .chunk(24)
      .map(cityArray => cityArray.last());
    const cities = citiesRaw.map(city => ({
      name: city.StationName[0],
      data: city['PM2.5'][0] === '-' ? 0 : Math.round(parseFloat(city['PM2.5'][0])),
    }));
    return Promise.map(
      cities,
      city => geocoder.getLatLng(`${city.name}, Hong Kong`)
        .then(location => Object.assign(city, { location })),
      { concurrency: 2 },
    );
  },
};
