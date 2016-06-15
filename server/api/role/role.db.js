'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');

var util = require('./../../utils/utils');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/role.initialize.sql')
  })
  .then(function (result) {
    util.log('Role table all set up.');
  })
  .catch(function (err) {
    util.log('Couldn\'t set up Role table.');
    util.log(err);
  });
}

function popInitialize() {
  return sql.execute({
    query: sql.fromFile('./sql/pop.role.initialize.sql')
  })
  .then(function (result) {
    util.log('Role table all set up.');
  })
  .catch(function (err) {
    util.log('Couldn\'t set up Role table.');
    util.log(err);
  });
}

exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/role.getAll.sql')
  });
};

// initialize();
popInitialize();
