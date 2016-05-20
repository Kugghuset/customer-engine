'use strict'

var express = require('express');
var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var bodyParser = require('body-parser');
var chalk = require('chalk');

var config = require('./server/config/config');
var logger = require('./server/utils/logger.util')

// Setup the database.
sql.setDefaultConfig(config.db);

var nps = require('./server/services/nps').module;

nps.sendSurway(0)
.then(function (data) {
  console.log(chalk.green(
    '{num} messages sent.'.replace('{num}', _.get(data, 'length') || 0)
  ));
})
.catch(function (err) {
  console.log(err);
});
