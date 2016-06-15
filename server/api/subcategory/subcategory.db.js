'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');

var util = require('./../../utils/utils');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/subcategory.initialize.sql')
  })
  .then(function (result) {
    util.log('Subcategory table all set up.');
  })
  .catch(function (err) {
    util.log('Couldn\'t set up Subcategory table.');
    util.log(err);
  });
}

function popInitialize() {
  return sql.execute({
    query: sql.fromFile('./sql/pop.subcategory.initialize.sql')
  })
  .then(function (result) {
    util.log('Subcategory table all set up.');
  })
  .catch(function (err) {
    util.log('Couldn\'t set up Subcategory table.');
    util.log(err);
  });
}

exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/subcategory.getAll.sql')
  });
};

// initialize();
popInitialize();
