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
    console.log(this.getPageUrl());
    const _this = this;
    return fetch(this.getPageUrl())
      .then(function(res) {
        return res.text();
      })
      .then(function(htmlText) {
        var $ = cheerio.load(htmlText);
        const citiesData = $('section#content table tr').map(function(row_idx, row) {
          var obj = {}
          const columns = $(this).children().filter(function(value) { return !$(this).text().isEmpty() });
          const cityColumn = columns.first();
          const data = columns.last().text();

          obj.name = _this.getCityName(cityColumn)
          if (numberRegex.test(data)) {
            obj.data = parseInt(data.match(numberRegex)[0], 10);
          } else {
            obj.data = 0;
          }
          return obj;
        }).get().slice(1);

        return citiesData;
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
  },

  getCityName: function(cityColumn) {
    return `${cityColumn.next().text()}, ${cityColumn.text()}`
  },

  getPageUrl: function() {
    const now = moment();
    return `http://apims.doe.gov.my/v2/hour${this.getPageNumber(now)}_${now.format('YYYY-MM-DD')}.html`
  },

  getPageNumber: function(time) {
    const hour = time.hour();
    var pageNumber = 1;
    if (hour >= 18) {
      pageNumber = 4;
    } else if (hour >= 12) {
      pageNumber = 3;
    } else if (hour >= 6) {
      pageNumber = 2;
    }

    return pageNumber
  }
}
