'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');

var customerFilePath = path.resolve('./server/assets/customers/customers.csv');

function intialize() {
  return sql.execute({
    query: sql.fromFile('./sql/customer.initialize.sql')
  })
  .then(function (result) {
    console.log('Customer table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up Customer table.');
    console.error(err);
  });
}

exports.getFuzzy = function (query) {
  return sql.execute({
    query: sql.fromFile('./sql/customer.getFuzzy.sql'),
    params: {
      query: {
        type: sql.VARCHAR(256),
        val: query
      }
    }
  });
}

function bulkImport() {
  if (!fs.existsSync(customerFilePath)) {
    // No file to import.
    return;
  }
  
  // Get the actual path to the customers.csv file
  var _query = sql
    .fromFile('./sql/customer.bulkImport.sql')
    .replace('{ filepath }', customerFilePath);
    
  return sql.execute({
    query: _query
  }).then(function (result) {
    // Do something?
  })
  .catch(function (err) {
    // Handle error
  });
}

intialize();
bulkImport();
