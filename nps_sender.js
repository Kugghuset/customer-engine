'use strict'

var express = require('express');
var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var bodyParser = require('body-parser');

var config = require('./server/config/config');
var logger = require('./server/utils/logger.util')

var nps = require('./server/services/nps').module;

// Setup the database.
sql.setDefaultConfig(config.db);

nps.getAndSend()
.then(function(res) {
  console.log(res);
})
.catch(function(err) {
  console.log(err);
})