// !#/usr/bin/env node
require('dotenv').config();
const db = require('../app/db/middleware');

const sg = require('../app/scrapers/singapore');
const my = require('../app/scrapers/malaysia');
const tw = require('../app/scrapers/taiwan');
const hk = require('../app/scrapers/hongkong');
const usa = require('../app/scrapers/usa');
const nl = require('../app/scrapers/netherlands');

const logConsole = (args) => {
  console.log(JSON.stringify(args, null, 2));
  return args;
};

console.log('Beginning Singapore Scrape...');
sg.scrape()
  .then(logConsole)
  .then(result => result.map(db.dispatchCity));

console.log('Beginning Malaysia Scrape...');
my.scrape()
  .then(logConsole)
  .then(result => result.map(db.dispatchCity));

tw.scrape()
  .then(logConsole)
  .then(result => result.map(db.dispatchCity));

console.log('Beginning Hong Kong Scrape...');
hk.scrape()
  .then(logConsole)
  .then(result => result.map(db.dispatchCity));

console.log('Beginning Netherlands Scrape...');
nl.scrape()
  .then(logConsole)
  .then(result => result.map(db.dispatchCity));

console.log('Beginning United States of America Scrape...');
usa.scrape()
  .then(logConsole)
  .then(result => result.map(db.dispatchCity));
