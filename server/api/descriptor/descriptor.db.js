'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/descriptor.initialize.sql')
  });
}

function popInitialize() {
  return sql.execute({
    query: sql.fromFile('./sql/pop.descriptor.initialize.sql')
  });
}

// initialize();
popInitialize();

module.exports = {}