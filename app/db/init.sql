# THIS IS NOT READY YET. DONT USE IT AS THE ACTUAL DATABASE SCHEMA

CREATE TABLE cities
(
    id INTEGER DEFAULT nextval('cities_id_seq'::regclass) NOT NULL,
    name VARCHAR(255) NOT NULL,
    location GEOGRAPHY NOT NULL
);
CREATE UNIQUE INDEX cities_id_uindex ON cities (id);
CREATE TABLE cities_pm25
(
    id INTEGER PRIMARY KEY NOT NULL,
    city_id INTEGER NOT NULL,
    data INTEGER NOT NULL,
    date_recorded TIMESTAMP DEFAULT now(),
    CONSTRAINT cities_pm25_cities_id_fk FOREIGN KEY (city_id) REFERENCES
);
CREATE UNIQUE INDEX cities_pm25_id_uindex ON cities_pm25 (id);
