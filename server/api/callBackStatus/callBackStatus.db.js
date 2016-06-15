'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');

var util = require('../../utils/utils');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/callBackStatus.initialize.sql')
  })
  .then(function (result) {
    util.log('CallBackStatus table all set up.');
  })
  .catch(function (err) {
    util.log('Couldn\'t set up CallBackStatus table.');
    util.log(err);
  });
}

exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/callBackStatus.getAll.sql')
  });
};

initialize();
