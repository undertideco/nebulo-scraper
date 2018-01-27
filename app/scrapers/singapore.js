const fetch = require('node-fetch');
const urls = require('../constants/urls');
const Promise = require('bluebird');
const xml2js = require('xml2js');

const parseString = Promise.promisify(xml2js.parseString);

const codeMap = {
  rNO: 'North, Singapore',
  rCE: 'Central, Singapore',
  rEA: 'East, Singapore',
  rWE: 'West, Singapore',
  rSO: 'South, Singapore',
};

module.exports = {
  scrape: () => fetch(urls.SINGAPORE_URL)
    .then(response => response.text())
    .then(parseString)
    .then(result => result.channel.item[0].region)
    .then(regions => regions.map(region => ({
      name: codeMap[region.id[0]],
      location: {
        lat: parseFloat(region.latitude[0]),
        lng: parseFloat(region.longitude[0]),
      },
      data: parseInt(region.record[0].reading[0].$.value, 10),
    }))),
};
