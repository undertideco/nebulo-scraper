// !#/usr/bin/env node
const db = require('../app/db/middleware');

const sg = require('../app/scrapers/singapore');
const my = require('../app/scrapers/malaysia');

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
