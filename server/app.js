'use strict'

var express = require('express');
var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var config = require('./config/config');
var logger = require('./utils/logger.util')

var app = express();

/**
 * Setup the database.
 */
sql.setDefaultConfig(config.db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('combined', { stream: logger.stream }));
require('./api/routes')(app, logger);

function serve() {
  var server = app.listen(config.port, config.ip, function () {
    var port = server.address().port;
    
    logger.stream.write('App listening on port ' + port);
  });
}

// Serve the app
serve();