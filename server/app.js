'use strict'

var express = require('express');
var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var bodyParser = require('body-parser');

var config = require('./config/config');
var logger = require('./utils/logger.util')

var app = express();


// Setup the database.
sql.setDefaultConfig(config.db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./api/routes')(app, logger);

require('./services/nps');
require('./services/merge');

function serve() {
  var server = app.listen(config.port, function () {
    var port = server.address().port;
    
    logger.stream.write('App listening on port ' + port);
  });
}

// Serve the app
serve();