'use strict'

var _ = require('lodash');
var userConfig = require('../../userConfig');

module.exports = {
  port: process.env.PORT || userConfig.port || 5000,
  ip: userConfig.ip || '127.0.0.1',
  db: {
    server: userConfig.server || 'MSSQL',
    user: userConfig.user || 'sa',
    password: userConfig.password || 'pass',
    database: userConfig.database || 'customer-engine',
    options: _.assign({}, { encrypt: true }, userConfig.options)
  },
  secrets: {
    session: 'sssshhharedSecret'
  }
};