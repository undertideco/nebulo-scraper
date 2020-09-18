import Bluebird from 'bluebird';
import pg, { Pool } from 'pg';
import { SocksClient } from 'socks';
import { Duplex } from 'stream';

import { City } from './models';

const { DATABASE_URL, NODE_ENV, FIXIE_SOCKS_HOST } = process.env;

let cachedPool: Pool | null = null;

const getPool = async (): Promise<Pool> => {
  if (cachedPool !== null) {
    return cachedPool;
  }

  let stream: Duplex | undefined = undefined;

  if (!DATABASE_URL) {
    throw new Error('Missing DATABASE_URL');
  }

  if (FIXIE_SOCKS_HOST) {
    const fixieValues = FIXIE_SOCKS_HOST.split(new RegExp('[/(:\\/@)/]+'));

    const dbURL = new URL(DATABASE_URL);

    const conn = await SocksClient.createConnection({
      proxy: {
        type: 5,
        userId: fixieValues[0],
        password: fixieValues[1],
        host: fixieValues[2],
        port: parseInt(fixieValues[3], 10),
      },
      command: 'connect',
      destination: {
        host: dbURL.host,
        port: parseInt(dbURL.port, 10),
      },
    });
    stream = conn.socket;
  }

  const pool = new pg.Pool({
    connectionString: DATABASE_URL,
    max: 10,
    keepAlive: true,
    connectionTimeoutMillis: 10000, // 10 seconds
    idleTimeoutMillis: 30000,
    stream,
    ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  });

  cachedPool = pool;

  return pool;
};

const getCityId = async (city: City) => {
  const pool = await getPool();
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
  const pool = await getPool();
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

export const endPool = async (): Promise<void> => {
  await cachedPool?.end();
};
