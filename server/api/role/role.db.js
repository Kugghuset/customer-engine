'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/role.initialize.sql')
  })
  .then(function (result) {
    console.log('Role table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up Role table.');
    console.error(err);
  });
}

function popInitialize() {
  return sql.execute({
    query: sql.fromFile('./sql/pop.role.initialize.sql')
  })
  .then(function (result) {
    console.log('Role table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up Role table.');
    console.error(err);
  });
}

exports.getAll = function () {
  return sql.execute({  
    query: sql.fromFile('./sql/role.getAll.sql')
  });
};

// initialize();
popInitialize();
