const fetch = require('node-fetch');
const urls = require('../constants/urls');

module.exports = {
  scrape: async () => {
    const json = await fetch(urls.NETHERLANDS_URL)
      .then(response => response.json());
    return json.stations
      .filter(({ measurement }) => measurement !== null)
      .map(({ station, measurement }) => ({
        name: station.location,
        data: measurement.rounded,
        location: {
          lat: station.geo.coordinates[0],
          lng: station.geo.coordinates[1],
        },
      }));
  },
};
