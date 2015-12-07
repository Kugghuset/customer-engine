'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/categoryBlob.initialize.sql')
  })
  .then(function (result) {
    console.log('CategoryBlob table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up CategoryBlob table.');
    console.error(err);
  });
}

initialize();

module.exports = {}