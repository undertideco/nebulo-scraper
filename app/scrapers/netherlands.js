const fetch = require('node-fetch');
const urls = require('../constants/urls');

const CATEGORY_PM25 = 114;

module.exports = {
  scrape: () => fetch(`${urls.NETHERLANDS_URL}/stations?category=${CATEGORY_PM25}`)
    .then(response => response.json())
    .then(json => json.map(city => ({
      id: city.properties.id,
      name: city.properties.label.replace(': PM2.5', ''),
      data: 0,
      location: {
        lat: city.geometry.coordinates[1],
        lng: city.geometry.coordinates[0],
      },
    })))
    .then(citiesData => fetch(`${urls.NETHERLANDS_URL}/timeseries/getData`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeseries: citiesData.map(city => city.id),
        timespan: `PT20M/${new Date().toISOString().split('.')[0]}`,
      }),
    }).then(response => response.json())
      .then(resp => citiesData.filter(city => resp[city.id].values.length > 0)
        .map(city => Object.assign(city, {
          data: parseInt(resp[city.id].values[resp[city.id].values.length - 1].value, 10),
        }))
        .map((city) => {
          const copy = Object.assign({}, city);
          delete copy.id;
          return copy;
        }))),
};
