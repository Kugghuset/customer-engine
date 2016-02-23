'use strict'

var express = require('express');
var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var bodyParser = require('body-parser');

var config = require('./server/config/config');
var logger = require('./server/utils/logger.util')

var app = express();

// Setup the database.
sql.setDefaultConfig(config.db);

var xlsxService = require('./server/services/xlsx').watchFolder(config.baseFolder);
