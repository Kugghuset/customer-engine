'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var fs = require('fs');
var path = require('path');

var npsFilePath = path.resolve('./server/assets/nps/total_nps_score.csv');

function initialize() {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/npsResponse.initialize.sql')
    })
    .then(function (result) {
      console.log('NPSResponse table all set up.');
      resolve(result);
    })
    .catch(function (err) {
      console.log('Couldn\'t set up NPSResponse table.');
      console.error(err);
      reject(err);
    });
  });
}

exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/npsResponse.getAll.sql')
  });
};

function bulkImport() {
  
  if (!fs.existsSync(npsFilePath)) {
    // No file to import.
    return;
  }
  
  sql.execute({
    query: sql
      .fromFile('./sql/npsResponse.bulkImport.sql')
      .replace('{ filepath }', npsFilePath)
  }).then(function (result) {
    // Do something?
    
    console.log(result);
    
  }).catch(function (err) {
    // Handle error
  });
}

initialize()
.then(bulkImport);
