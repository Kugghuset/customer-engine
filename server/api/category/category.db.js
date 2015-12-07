'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/category.initialize.sql')
  })
  .then(function (result) {
    console.log('Category table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up Category table.');
    console.error(err);
  });
}

function popInitialize() {
  return sql.execute({
    query: sql.fromFile('./sql/pop.category.initialize.sql')
  })
  .then(function (result) {
    console.log('Category table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up Category table.');
    console.error(err);
  });
}

exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/category.getAll.sql')
  });
};

// initialize();
popInitialize();
