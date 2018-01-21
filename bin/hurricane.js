// !#/usr/bin/env node
const db = require('../app/db/middleware');

const sg = require('../app/scrapers/singapore');
const my = require('../app/scrapers/malaysia');
const tw = require('../app/scrapers/taiwan');
const hk = require('../app/scrapers/hongkong');
const usa = require('../app/scrapers/usa');
const nl = require('../app/scrapers/netherlands');

sg.scrape().then(function(result){
  result.forEach(function(city) {
    console.log(city);
    db.dispatchCity(city);
  });
});

my.scrape().then(function(result) {
  result.forEach(function(city) {
    console.log(city);
    db.dispatchCity(city);
  });
})

tw.scrape().then(function(result) {
  result.forEach(function(city) {
    console.log(city);
    db.dispatchCity(city);
  });
})

hk.scrape().then(function(result) {
  result.forEach(function(city) {
    console.log(city);
    db.dispatchCity(city);
  });
})

nl.scrape().then(function(result) {
  result.forEach(function(city) {
    console.log(city);
    db.dispatchCity(city);
  });
})

usa.scrape().then(function(result) {
  result.forEach(function(city) {
    console.log(city);
    db.dispatchCity(city);
  });
})
