'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');

function intialize() {
  return sql.execute({
    query: sql.fromFile('./sql/customer.initialize.sql')
  });
}

exports.getFuzzy = function (query) {
  return sql.execute({
    query: sql.fromFile('./sql/customer.getFuzzy.sql'),
    params: {
      query: {
        type: sql.VARCHAR(256),
        val: query
      }
    }
  });
}

intialize();