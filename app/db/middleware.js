const pg = require('pg');

const {
  USER, PGUSER, PGHOST, PGPASSWORD, PGDATABASE, PGPORT, NODE_ENV,
} = process.env;

const pool = new pg.Pool({
  host: PGHOST || '127.0.0.1',
  user: PGUSER || USER,
  password: PGPASSWORD,
  database: PGDATABASE || 'nebulo_dev',
  port: PGPORT || 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : null,
});

const getCityId = async (city) => {
  const client = await pool.connect();
  const queryResult = await client.query('SELECT * FROM cities WHERE name = $1', [city.name]);
  const cityId = queryResult && queryResult.rows[0] ? queryResult.rows[0].id : null;
  if (cityId != null) {
    return cityId;
  }
  try {
    const insertResult = await client.query('INSERT INTO cities(name, location) VALUES($1, st_makepoint($2, $3)) returning id', [city.name, city.location.lng, city.location.lat]);
    return insertResult.rows[0].id;
  } catch (e) {
    console.log(`Error processing\n${JSON.stringify(city, null, 2)}`);
    throw e;
  }
};

module.exports = {
  /**
   * Dispatch city into database
   * @param {Object} city City
   * @param {string} city.name city name
   * @param {Object} city.location geographical location
   * @param {Number} city.location.lat latitude
   * @param {Number} city.location.lng longitude
   * @param {Number} city.data air quality data
   */
  dispatchCity: async city => getCityId(city)
    .then(cityId => pool.connect()
      .then(client => client.query('INSERT into cities_pm25(city_id, data) VALUES($1, $2)', [cityId, city.data]))),
};
