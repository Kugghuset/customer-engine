'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/subcategory.initialize.sql')
  });
}

function popInitialize() {
  return sql.execute({
    query: sql.fromFile('./sql/pop.subcategory.initialize.sql')
  });
}

exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/subcategory.getAll.sql')
  });
};

// initialize();
popInitialize();
