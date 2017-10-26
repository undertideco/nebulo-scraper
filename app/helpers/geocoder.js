const fetch = require('node-fetch');
const { GOOGLE_GEOCODING_API_KEY } = process.env;

module.exports = {
  getLatLng: function(cityName) {
    var params = {
      address: cityName,
      key: GOOGLE_GEOCODING_API_KEY,
    }

    return fetch('https://maps.googleapis.com/maps/api/geocode/json?' + this.makeParamsQueryString(params))
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        return data.results[0].geometry.location;
      })
      .catch(function(error) {
        console.log('geocoder request failed', error)
      });
  },

  makeParamsQueryString: function(params) {
    var esc = encodeURIComponent;
    return Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');
  }
}
