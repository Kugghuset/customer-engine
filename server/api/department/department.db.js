'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/department.initialize.sql')
  })
  .then(function (result) {
    console.log('Department table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up Department table.');
    console.error(err);
  });
}

function popInitialize() {
  return sql.execute({
    query: sql.fromFile('./sql/pop.department.initialize.sql')
  })
  .then(function (result) {
    console.log('Department table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up Department table.');
    console.error(err);
  });
}

/**
 * Gets all departments
 * 
 * @return {Promise} -> {Array} (Department)
 */
exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/department.getAll.sql')
  });
}

// initialize();
popInitialize();
