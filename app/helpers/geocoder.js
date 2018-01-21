const fetch = require('node-fetch');

const { GOOGLE_GEOCODING_API_KEY } = process.env;

module.exports = {
  getLatLng: (cityName) => {
    const params = {
      address: cityName,
      key: GOOGLE_GEOCODING_API_KEY,
    };

    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?${this.makeParamsQueryString(params)}`)
      .then(res => res.json())
      .then(data => data.results[0].geometry.location)
      .catch(error => console.log('geocoder request failed', error));
  },

  getAddress: (lat, lng) => {
    const params = {
      latlng: `${lat},${lng}`,
      key: GOOGLE_GEOCODING_API_KEY,
    };

    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?${this.makeParamsQueryString(params)}`)
      .then(res => res.json())
      .then(data => data.results[0].address_components
        .filter(component => component.types.includes('route') ||
          component.types.includes('sublocality') ||
          component.types.includes('locality'))
        .map(component => component.short_name)
        .join(', '))
      .catch(error => console.log('geocoder request failed', error));
  },

  makeParamsQueryString: params => Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&'),
};
