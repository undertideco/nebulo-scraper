// !#/usr/bin/env node
const sg_db = require('../app/db/sg_db');
const sg = require('../app/scrapers/singapore')

sg.scrape().then(function(result){
  result.forEach(function(city) {
    sg_db.dispatchCity(city);
  });
});
