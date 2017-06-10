const fetch = require('node-fetch');
const moment = require('moment');
const cheerio = require('cheerio');
const geocoder = require('../helpers/geocoder');
const urls = require('../constants/urls');

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim() || this == 'n/a');
};

module.exports = {
  scrape: function() {
    const numberRegex = /(\d+)/;

    console.log("Beginning Malaysia Scrape...");
    const _this = this;
    return fetch(urls.MALAYSIA_URL)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const cities = json["24hour_api"];
        cities.shift();
        console.log(cities);
        return cities.map((city) => {
          var obj = {}
          obj.name = `${city[1]}, ${city[0].charAt(0) + city[0].substring(1).toLowerCase()}`
          let data = city.slice(-1)[0]

          if (numberRegex.test(data)) {
            obj.data = parseInt(data.match(numberRegex)[0], 10);
          } else {
            obj.data = 0;
          }

          return obj;
        });
      })
      .then(function(citiesData) {
        let promises = citiesData.map(function(city) {
          return geocoder.getLatLng(city.name)
            .then(function(locationObj) {
              city.location = locationObj;
              return city;
            })
        });

        return Promise.all(promises)
          .then(function(results) {
            return results;
          })
          .catch(function(error) {
            console.log(error);
          });
      });
  }
}
