'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/product.initialize.sql')
  })
  .then(function (result) {
    console.log('Product table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up Product table.');
    console.error(err);
  });
}

function popInitialize() {
  return sql.execute({
    query: sql.fromFile('./sql/pop.product.initialize.sql')
  })
  .then(function (result) {
    console.log('Product table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up Product table.');
    console.error(err);
  });
}

/**
 * Gets all products
 * 
 * @return {Promise} -> {Array} (Product)
 */
exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/product.getAll.sql')
  });
}

// initialize();
popInitialize();
