'use strict'

var winston = require('winston');
var Promise = require('bluebird');

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp: true
    })
  ],
  exitOnError: true
});

var stream = {
  write: function (message, encoding) {
    logger.info(message);
  }
};

module.exports = logger;
module.exports.stream = stream;