'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/descriptor.initialize.sql')
  })
  .then(function (result) {
    console.log('Descriptor table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up Descriptor table.');
    console.error(err);
  });
}

function popInitialize() {
  return sql.execute({
    query: sql.fromFile('./sql/pop.descriptor.initialize.sql')
  })
  .then(function (result) {
    console.log('Descriptor table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up Descriptor table.');
    console.error(err);
  });
}

exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/descriptor.getAll.sql')
  });
};

// initialize();
popInitialize();
