import Bluebird from 'bluebird';
import pg from 'pg';

import { City } from './models';

const { DATABASE_URL, NODE_ENV } = process.env;

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  max: 10,
  keepAlive: true,
  connectionTimeoutMillis: 10000, // 10 seconds
  idleTimeoutMillis: 30000,
  ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

const getCityId = async (city: City) => {
  const queryResult = await pool.query('SELECT * FROM cities WHERE name = $1', [
    city.name,
  ]);
  const cityId =
    queryResult && queryResult.rows[0] ? queryResult.rows[0].id : null;
  if (cityId != null) {
    return cityId;
  }
  try {
    const insertResult = await pool.query(
      'INSERT INTO cities(name, location) VALUES($1, st_makepoint($2, $3)) returning id',
      [city.name, city.location.lng, city.location.lat]
    );
    return insertResult.rows[0].id;
  } catch (e) {
    console.log(`Error processing\n${JSON.stringify(city, null, 2)}`);
    throw e;
  }
};

export const dispatchCities = async (cities: City[]): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await Bluebird.each(cities, async (city) => {
      const cityID = await getCityId(city);
      await pool.query(
        'INSERT into cities_pm25(city_id, data) VALUES($1, $2)',
        [cityID, city.data]
      );
    });
    await client.query('COMMIT');
  } catch (e) {
    console.error('Could not insert new city data', e);
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export const endPool = (): Promise<void> => pool.end();
