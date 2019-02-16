const fetch = require('node-fetch');
const urls = require('../constants/urls');

/* eslint-disable camelcase */

module.exports = {
  scrape: async () => {
    const { region_metadata, items } = await fetch(urls.SINGAPORE_URL)
      .then(response => response.json());
    const locations = {};
    region_metadata.forEach((rm) => {
      locations[rm.name] = {
        lat: rm.label_location.latitude,
        lng: rm.label_location.longitude,
      };
    });
    const { pm25_one_hourly } = items[0].readings;
    return Object.keys(pm25_one_hourly).map(region => ({
      name: `${region[0].toUpperCase() + region.substr(1)}, Singapore`,
      data: pm25_one_hourly[region],
      location: locations[region],
    }));
  },
};
