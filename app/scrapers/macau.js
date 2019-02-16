const fetch = require('node-fetch');
const Promise = require('bluebird');
const urls = require('../constants/urls');
const geocoder = require('../helpers/geocoder');
const xml2js = require('xml2js');

const parseString = Promise.promisify(xml2js.parseString);

const locations = {
  澳門高密度住宅區: { lat: 22.213889, lng: 113.542778 },
  澳門路邊站: { lat: 22.195833, lng: 113.544722 },
  氹仔一般性: { lat: 22.160000, lng: 113.565000 },
  氹仔高密度住宅區: { lat: 22.159574, lng: 113.554088 },
  路環一般性: { lat: 22.125278, lng: 113.554444 },
  九澳路邊站: { lat: 22.132710, lng: 113.584168 },
};

module.exports = {
  scrape: async () => {
    const xml = await fetch(urls.MACAU_URL)
      .then(response => response.text())
      .then(parseString);
    const citiesRaw = xml.IQA.Custom[0].AQIReport;
    const cities = citiesRaw.map(city => ({
      name: city.Station[0].Stationname[0].Chinese[0],
      data: parseInt(city.Station[0].Element[0].PM25[0].AQI[0], 10),
      location: locations[city.Station[0].Stationname[0].Chinese[0]],
    }));
    return Promise.map(
      cities,
      (city) => {
        if (!city.location) {
          return geocoder.getLatLng(city.name.replace(/(路邊站|一般性|高密度住宅區)/, ''))
            .then(location => Object.assign(city, { location }));
        }
        return city;
      },
      { concurrency: 2 },
    );
  },
};
