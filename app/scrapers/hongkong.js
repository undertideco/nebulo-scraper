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
  scrape: () => fetch(urls.HONGKONG_URL)
    .then(response => response.text())
    .then(parseString)
    .then(result => result.AQHI24HrPollutantConcentration.PollutantConcentration
      .chunk(24)
      .map(cityArray => cityArray.last()))
    .then(json => json.map(city => ({
      name: city.StationName[0],
      data: city['PM2.5'][0] === '-' ? 0 : Math.round(parseFloat(city['PM2.5'][0])),
    })))
    .then(citiesData => Promise.map(
      citiesData,
      city => geocoder.getLatLng(`${city.name}, Hong Kong`)
        .then(location => Object.assign(city, { location })),
      { concurrency: 2 },
    ).catch(console.error)),
};
