const fetch = require('node-fetch');
const urls = require('../constants/urls');
const geocoder = require('../helpers/geocoder');
const parseString = require('xml2js').parseString;

Array.prototype.chunk = function(length) {
  var chunkarr = [],
    i = 0,
    n = this.length;

  while (i < n) {
    chunkarr.push(this.slice(i, i += length));
  }

  return chunkarr;
}

Array.prototype.last = function() {
  return this.slice(-1)[0]
}

module.exports = {
  scrape: () => {
    console.log("Beginning Hong Kong Scrape...");
    return fetch(urls.HONGKONG_URL)
      .then((response) => {
        return response.text();
      })
      .then((xml) => {
        var regions;
        parseString(xml, function (err, result) {
          var resultArray = result.AQHI24HrPollutantConcentration.PollutantConcentration;
          var newArray = resultArray.chunk(24).map((cityArray) => {
            return cityArray.last();
          });

          regions = newArray;
        });
        return regions;
      })
      .then((json) => {
        return json.map((city) => {
          var pm25 = city['PM2.5'][0] === '-' ? 0 : Math.round(parseFloat(city['PM2.5'][0]));
          return  {
            name: city.StationName[0],
            data: pm25
          }
        })
      })
      .then((citiesData) => {
        let promises = citiesData.map(function(city) {
          var cityNameLookup = `${city.name}, Hong Kong`
          return geocoder.getLatLng(cityNameLookup)
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
  },

  parseTitleForCityName: (cityString) => {
    return cityString.trim().split(':')
  }
}
