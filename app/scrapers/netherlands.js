const fetch = require('node-fetch');
const Promise = require('bluebird');
const urls = require('../constants/urls');

const CATEGORY_PM25 = 114;

module.exports = {
  scrape: () => {
    return fetch(`${urls.NETHERLANDS_URL}/stations?category=${CATEGORY_PM25}`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return json.map((city) => {
          return  {
            id: city.properties.id,
            name: city.properties.label.replace(': PM2.5', ''),
            data: 0,
            location: {
              lat: city.geometry.coordinates[1],
              lng: city.geometry.coordinates[0]
            }
          }
        });
      })
      .then((citiesData) => {
        return fetch(`${urls.NETHERLANDS_URL}/timeseries/getData`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            timeseries: citiesData.map(city => city.id),
            timespan: `PT20M/${new Date().toISOString().split('.')[0]}`
          })
        }).then(response => response.json())
          .then((citiesAirData) => {
            for (const cityID in citiesAirData) {
              const values = citiesAirData[cityID].values;
              if (values.length > 0) {
                const index = citiesData.findIndex(city => city.id === parseInt(cityID, 10));
                citiesData[index].data = parseInt(values[values.length - 1].value, 10);
                delete citiesData[index].id;
              }
            }
            return citiesData;
        })
      });
  }
}
