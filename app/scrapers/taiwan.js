const fetch = require('node-fetch');
const Promise = require('bluebird');
const urls = require('../constants/urls');
const geocoder = require('../helpers/geocoder');

const geocoderExceptions = {
  '安南, 臺南市': '安南'
}

module.exports = {
  scrape: () => {
    return fetch(urls.TAIWAN_URL)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return json.map((city) => {
          return  {
            name: `${city.SiteName}, ${city.County}`,
            data: parseInt( city['PM2.5'], 10) || 0
          }
        });
      })
      .then((citiesData) => {
        return Promise.map(citiesData, (city) => {
          var cityNameLookup = geocoderExceptions[city.name] || city.name
          return geocoder.getLatLng(cityNameLookup)
            .then(function(locationObj) {
              city.location = locationObj;
              return city;
            });
        }, { concurrency: 5 })
          .then(function(results) {
            return results;
          })
          .catch(function(error) {
            console.log(error);
          });
      });
  }
}
