'use strict'

var express = require('express');
var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var bodyParser = require('body-parser');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');

var config = require('./server/config/config');
var logger = require('./server/utils/logger.util')

// Setup the database.
sql.setDefaultConfig(config.db);

var nps = require('./server/services/nps').module;

// Get the args
var args = process.argv.map(function (val, index, array) { return val }).slice(2);

var options = {}
var currentKey;

// Iterate over all args to populate *options*
args.forEach(function (val) {
  // Set current key if *val* starts with -[-]
  if (/^\-+/.test(val)) {
    currentKey = val.replace(/^\-+/, '');
    // At least append the key
    return options[currentKey] = undefined;
  }

  options[currentKey] = (typeof options[currentKey] === 'undefined')
    ? val
    : options[currentKey] + ' ' + val;
})

/************************
 *
 * Command handlers
 *
 ***********************/

var weeks = _.isUndefined(options.weeks)
  ? 0
  : parseInt(options.weeks);

nps.sendSurway(weeks || 0)
.then(function (data) {
  console.log(chalk.green(
    '{num} messages sent.'.replace('{num}', _.get(data, 'length') || 0)
  ));
})
.catch(function (err) {
  console.log(err);
});
