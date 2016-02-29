'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');

var util = require('../../utils/utils');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/reasonToDetract.initialize.sql')
  })
  .then(function (result) {
    console.log('ReasonToDetract table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up ReasonToDetract table.');
    console.error(err);
  });
}

exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/ReasonToDetract.getAll.sql')
  });
};

initialize();
