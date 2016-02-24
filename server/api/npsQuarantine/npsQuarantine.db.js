'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var fs = require('fs');
var path = require('path');
var iconv = require('iconv-lite');
var chalk = require('chalk');
var os = require('os');


function initialize() {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/npsQuarantine.initialize.sql')
    })
    .then(function (result) {
      console.log('npsQuarantine table all set up.');
      resolve(result);
    })
    .catch(function (err) {
      console.log('Couldn\'t set up npsQuarantine table.');
      console.error(err);
      reject(err);
    });
  });
}


module.exports = {
  initialize: initialize
};