'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');
var util = require('./../../utils/utils');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/department.initialize.sql')
  })
  .then(function (result) {
    util.log('Department table all set up.');
  })
  .catch(function (err) {
    util.log('Couldn\'t set up Department table.');
    util.log(err);
  });
}

function popInitialize() {
  return sql.execute({
    query: sql.fromFile('./sql/pop.department.initialize.sql')
  })
  .then(function (result) {
    util.log('Department table all set up.');
  })
  .catch(function (err) {
    util.log('Couldn\'t set up Department table.');
    util.log(err);
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
