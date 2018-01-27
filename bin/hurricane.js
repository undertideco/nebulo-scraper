// !#/usr/bin/env node
const db = require('../app/db/middleware');

const sg = require('../app/scrapers/singapore');
const my = require('../app/scrapers/malaysia');
const tw = require('../app/scrapers/taiwan');
const hk = require('../app/scrapers/hongkong');
const usa = require('../app/scrapers/usa');
const nl = require('../app/scrapers/netherlands');

const logConsole = (...args) => {
  console.log(args);
  return args;
};

console.log('Beginning Singapore Scrape...');
sg.scrape()
  .then(result => result.map(logConsole))
  .then(result => result.map(city => db.dispatchCity(city)));

console.log('Beginning Malaysia Scrape...');
my.scrape()
  .then(result => result.map(logConsole))
  .then(result => result.map(city => db.dispatchCity(city)));

tw.scrape()
  .then(result => result.map(logConsole))
  .then(result => result.map(city => db.dispatchCity(city)));

console.log('Beginning Hong Kong Scrape...');
hk.scrape()
  .then(result => result.map(logConsole))
  .then(result => result.map(city => db.dispatchCity(city)));

console.log('Beginning Netherlands Scrape...');
nl.scrape()
  .then(result => result.map(logConsole))
  .then(result => result.map(city => db.dispatchCity(city)));

console.log('Beginning United States of America Scrape...');
usa.scrape()
  .then(result => result.map(logConsole))
  .then(result => result.map(city => db.dispatchCity(city)));
