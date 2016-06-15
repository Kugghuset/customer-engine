'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var util = require('./../../utils/utils');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/descriptor.initialize.sql')
  })
  .then(function (result) {
    util.log('Descriptor table all set up.');
  })
  .catch(function (err) {
    util.log('Couldn\'t set up Descriptor table.');
    util.log(err);
  });
}

function popInitialize() {
  return sql.execute({
    query: sql.fromFile('./sql/pop.descriptor.initialize.sql')
  })
  .then(function (result) {
    util.log('Descriptor table all set up.');
  })
  .catch(function (err) {
    util.log('Couldn\'t set up Descriptor table.');
    util.log(err);
  });
}

exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/descriptor.getAll.sql')
  });
};

// initialize();
popInitialize();
