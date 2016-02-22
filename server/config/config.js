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
    database: userConfig.database || 'tickety',
    options: _.assign({
      encrypt: true,
      requestTimeout: 60000
    }, userConfig.options),
    pool: _.assign({
      max: 10,
      min: 4,
      idleTimeoutMillis: 60000
    }, userConfig.pool)
  },
  nps: {
    sendSms: _.isBoolean(userConfig.nps.sendSms) ? userConfig.nps.sendSms : false,
    serviceId: userConfig.nps.serviceId || '',
    password: userConfig.nps.password ||''
  },
  secrets: {
    session: 'sssshhharedSecret'
  },
  baseFolder: userConfig.baseFolder || ''
};