'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var Ticket = require('../ticket/ticket.db');

var util = require('../../utils/utils');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/reasonToPromote.initialize.sql')
  })
  .then(function (result) {
    util.log('ReasonToPromote table all set up.');
  })
  .catch(function (err) {
    util.log('Couldn\'t set up ReasonToPromote table.');
    util.log(err);
  });
}

exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/reasonToPromote.getAll.sql')
  });
};

initialize();
