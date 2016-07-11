'use strict'

var _ = require('lodash');
var env = require('node-env-file');
var path = require('path');
env(path.resolve(__dirname, '../../.env'));

var userConfig;

try {
  userConfig = require('../../userConfig');
} catch (err) {
  userConfig = { nps: {}, options: {} }
}

// Ensure no crash
if (!userConfig.nps) { userConfig.nps = {} }

/**
 * Converts somewhat boolean values and strings such as 'false'.
 *
 * @param {Any} input
 * @return {Boolean}
 */
function parseBool(input) {
  if (_.isUndefined(input)) { return undefined; }
  if (_.isBoolean(input)) { return input; }
  if (_.isString(input)) { return input != 'false'; }

  return !!input;
}

/**
 * Replaces dublicate '\\' to a single \\
 *
 * @param {String} str
 * @return {String}
 */
function fixBackslashes(str) {
  // If there is no string, return early
  if (_.isUndefined(str) || !_.isString(str)) { return str; }

  return str.replace(/\\{2,}/g,'\\');
}

/**
 * @param {Array}
 * @return {Boolean}
 */
function getBool(toCheck) {
  var values = _.map(toCheck, parseBool);

  return _.find(values, function (value) { return _.isBoolean(value); });
}

module.exports = {
  port: process.env.PORT || userConfig.port || 5000,
  ip: userConfig.ip || '127.0.0.1',
  db: {
    server: fixBackslashes(process.env.DB_SERVER) || userConfig.server || 'MSSQL',
    user: process.env.DB_USER || userConfig.user || 'sa',
    password: process.env.DB_PASSWORD || userConfig.password || 'pass',
    database: process.env.DB_DATABASE || userConfig.database || 'tickety',
    options: _.assign({
      encrypt: true,
      requestTimeout: 60000
    }, userConfig.options, {
      encrypt: parseBool(process.env.DB_ENCRYPT),
      requestTimeout: process.env.DB_REQUEST_TIMEOUT
    }),
    pool: {
      max: 10,
      min: 4,
      idleTimeoutMillis: 60000
    }
  },
  nps: {
    sendSms: getBool([process.env.NPS_SEND_SMS, userConfig.nps.sendSms, false]),
    serviceId: process.env.NPS_SERVICE_ID || userConfig.nps.serviceId || '',
    password: process.env.NPS_PASSWORD || userConfig.nps.password ||'',
    rowDelimiter: process.env.NPS_ROW_DELIMITER || '|\r\n|',
    columnDelimiter: process.env.NPS_COLUMN_DELIMITER || '\t',
  },
  secrets: {
    session: process.env.APP_SECRET || userConfig.appSecret || 'sssshhharedSecret'
  },
  baseFolder: fixBackslashes(process.env.BASE_FOLDER) || userConfig.baseFolder || '',
  surway: {
    base_url: process.env.SURWAY_URL,
    email: process.env.SURWAY_EMAIL,
    password:  process.env.SURWAY_PASSWORD,
  },
  cellsynt: {
    username: process.env.CELLSYNT_USERNAME || '',
    password: process.env.CELLSYNT_PASSWORD || '',
    destination: process.env.CELLSYNT_DESTINATION || '',
  },
};
