'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/subcategory.initialize.sql')
  })
  .then(function (result) {
    console.log('Subcategory table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up Subcategory table.');
    console.error(err);
  });
}

function popInitialize() {
  return sql.execute({
    query: sql.fromFile('./sql/pop.subcategory.initialize.sql')
  })
  .then(function (result) {
    console.log('Subcategory table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up Subcategory table.');
    console.error(err);
  });
}

exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/subcategory.getAll.sql')
  });
};

// initialize();
popInitialize();
