const pg = require('pg')

var config = {
  host: 'nebulov2-development.cdumdekqobqc.us-west-2.rds.amazonaws.com',
  max: 10,
  idleTimeoutMillis: 30000,
};

var pool = new pg.Pool(config);

module.exports = {
  getCityId: function(city, callback) {
    pool.connect(function(err, client, done) {
      client.query('SELECT * FROM cities WHERE name = $1', [city.name], function(err, result) {
        done();
        var cityId = result.rows[0] ? result.rows[0].id : null;
        if (err) {
          return console.error('error running query', err);
        }

        if (cityId != null) {
          callback(cityId);
          return;
        } else {
          client.query('INSERT INTO cities(name, location) VALUES($1, st_makepoint($2, $3)) returning id', [city.name, city.long, city.lat], function(err, result) {
            done();
            if (err) {
              return console.error('error running query', err);
            }
            callback(result.rows[0].id);
          });
        }
      });
    });
  },

  dispatchCity: function(city) {
    this.getCityId(city, (cityId) => {
      pool.connect(function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
        client.query('INSERT into cities_pm25(city_id, data) VALUES($1, $2)', [cityId, city.data], (err, result) => {
          done();
          if (err) {
            return console.error('error running query', err);
          }
        });
      });
    });
  }
}
