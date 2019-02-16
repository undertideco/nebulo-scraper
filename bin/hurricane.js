// !#/usr/bin/env node
require('dotenv').config();
const Promise = require('bluebird');
const db = require('../app/db/middleware');

const sg = require('../app/scrapers/singapore');
const my = require('../app/scrapers/malaysia');
const tw = require('../app/scrapers/taiwan');
const macau = require('../app/scrapers/macau');
const hk = require('../app/scrapers/hongkong');
const usa = require('../app/scrapers/usa');
const nl = require('../app/scrapers/netherlands');

const handleCountry = async (scrapeFunc) => {
  const data = await scrapeFunc();
  console.log(JSON.stringify(data));
  await Promise.all(data.map(db.dispatchCity));
};

const run = async () => {
  console.log('[SCRAPE] Starting work on Singapore');
  try {
    await handleCountry(sg.scrape);
  } catch (e) {
    console.error(e);
  }

  console.log('[SCRAPE] Starting work on Malaysia');
  try {
    await handleCountry(my.scrape);
  } catch (e) {
    console.error(e);
  }

  console.log('[SCRAPE] Starting work on Taiwan');
  try {
    await handleCountry(tw.scrape);
  } catch (e) {
    console.error(e);
  }

  console.log('[SCRAPE] Starting work on Hong Kong');
  try {
    await handleCountry(hk.scrape);
  } catch (e) {
    console.error(e);
  }

  console.log('[SCRAPE] Starting work on Macau');
  try {
    await handleCountry(macau.scrape);
  } catch (e) {
    console.error(e);
  }

  console.log('[SCRAPE] Starting work on Netherlands');
  try {
    await handleCountry(nl.scrape);
  } catch (e) {
    console.error(e);
  }

  console.log('[SCRAPE] Starting work on USA');
  try {
    await handleCountry(usa.scrape);
  } catch (e) {
    console.error(e);
  }
};

run()
  .then(() => db.endPool())
  .catch(console.error);
