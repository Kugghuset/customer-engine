'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/department.initialize.sql')
  });
}

function popInitialize() {
  return sql.execute({
    query: sql.fromFile('./sql/pop.department.initialize.sql')
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
