'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var util = require('./../../utils/utils');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/categoryBlob.initialize.sql')
  })
  .then(function (result) {
    util.log('CategoryBlob table all set up.');
  })
  .catch(function (err) {
    util.log('Couldn\'t set up CategoryBlob table.');
    util.log(err);
  });
}

initialize();

module.exports = {}