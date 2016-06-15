'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');

var util = require('./../../utils/utils');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/category.initialize.sql')
  })
  .then(function (result) {
    util.log('Category table all set up.');
  })
  .catch(function (err) {
    util.log('Couldn\'t set up Category table.');
    util.log(err);
  });
}

function popInitialize() {
  return sql.execute({
    query: sql.fromFile('./sql/pop.category.initialize.sql')
  })
  .then(function (result) {
    util.log('Category table all set up.');
  })
  .catch(function (err) {
    util.log('Couldn\'t set up Category table.');
    util.log(err);
  });
}

exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/category.getAll.sql')
  });
};

// initialize();
popInitialize();
