const fetch = require('node-fetch');
const Promise = require('bluebird');
const urls = require('../constants/urls');
const geocoder = require('../helpers/geocoder');

module.exports = {
  scrape: () => {
    return fetch(urls.USA_URL)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return json.map((city) => {
          return  {
            name: null,
            data: parseInt( city['AQI'], 10) || 0,
            location: {
              lat: city.Latitude,
              lng: city.Longitude
            }
          }
        });
      })
      .then((citiesData) => {
        return Promise.map(citiesData, (city) => {
          return geocoder.getAddress(city.location.lat, city.location.lng)
            .then(function(address) {
              city.name = address;
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
