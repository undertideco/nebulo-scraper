const fetch = require('node-fetch');
const urls = require('../constants/urls');
const parseString = require('xml2js').parseString;

const codeMap = {
  'rNO': 'North, Singapore',
  'rCE': 'Central, Singapore',
  'rEA': 'East, Singapore',
  'rWE': 'West, Singapore',
  'rSO': 'South, Singapore'
}

module.exports = {
  scrape: () => {
    console.log("Beginning Singapore Scrape...");
    return fetch(urls.SINGAPORE_URL)
      .then((response) => {
        return response.text();
      })
      .then((xml) => {
        var regions;
        parseString(xml, function (err, result) {
          regions = result.channel.item[0].region
        });
        return regions;
      })
      .then((regions) => {
        return regions.map((region) => {
          return {
            name: codeMap[region.id[0]],
            location: {
              lat: region.latitude[0],
              lng: region.longitude[0],
            },
            data: parseInt(region.record[0].reading[0].$.value, 10)
          }
        });
      });
  },
}
