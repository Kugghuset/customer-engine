'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');
var sql = require('seriate')
var moment = require('moment');

var utils = require('../utils/utils');
var config = require('../config/config');
var Ticket = require('../api/ticket/ticket.db');
var NPS = require('../api/nps/nps.db');
var NpsQuarantine = require('../api/npsQuarantine/npsQuarantine.db');
var schedule = require('./schedule');

/**
 * Finds all tickets created last week with tels which havenn't been sent out the last three months
 * and sends the sms to them.
 *
 * @param {Number} numberOfWeeks Defaults to 1
 * @return {Promise} -> {Array}
 */
function getAndSend(numberOfWeeks) {
  return sendSurway(numberOfWeeks);
}

/**
 * @param {Array} tels
 * @param {Array} finished
 * @return {Promise}
 */
function quarantineTels(tickets, finished) {
  if (!finished) { finished = []; }

  if (tickets.length === finished.length) {
    return Promise.resolve(finished);
  }

  var currentTicket = tickets[finished.length];

  return NpsQuarantine.insert(currentTicket)
  .then(function (item) {
    return quarantineTels(tickets, finished.concat([currentTicket]));
  })
  .catch(function (err) {
    utils.log(err);
    return quarantineTels(tickets, finished.concat([undefined]));
  });
}

/**
 * @param {Number} numberOfWeeks The number of weeks to go backwards. Defaults to 0
 * @return {Promis}
 */
function sendSurway(numberOfWeeks) {
  numberOfWeeks = !_.isUndefined(numberOfWeeks)
    ? numberOfWeeks
    : 0;

  utils.log('Beginning to send NPS data to Surway from {weeks} weeks.'.replace('{weeks}', numberOfWeeks));

  utils.cellsyntSMS('Beginning to send NPS data to Surway from {weeks} weeks.'.replace('{weeks}', numberOfWeeks))
  .catch(function (err) { utils.log('Something went wrong with sending the SMS to clickatell:\n {err}'.replace('{err}', err)); });

  var params = {
      upperDateLimit: {
        type: sql.DATETIME2,
        val: moment().subtract(numberOfWeeks, 'weeks').endOf('day').toDate(),
      },
      lowerDateLimit: {
        type: sql.DATETIME2,
        val: moment().subtract(numberOfWeeks + 1, 'weeks').startOf('day').toDate(),
      },
      threeMonthsAgo: {
        type: sql.DATETIME2,
        val: moment().subtract(3, 'months').toDate(),
      }
    };

  var _tickets;

  return sql.execute({
    query: sql.fromFile('./sql/nps.findSurwayTickets.sql'),
    params: params,
  })
  .then(function (tickets) {
    _tickets = tickets;

    utils.log('Found {num} tickets to send to Surway.'.replace('{num}', tickets.length));
    utils.log('Logging into Surway');

    var _url = config.surway.base_url + (
        /\/$/.test(config.surway.base_url)
          ? 'services/auth/login'
          : '/services/auth/login'
        );

    var data = { email: config.surway.email, password: config.surway.password };

    return utils.put(_url, data);
  })
  .then(function (userData) {

    var _token = userData.token;

    utils.log('Successfully logged in into Surway');

    var data = _.chain(_tickets)
      .map(function (item) {
        return [
          item['tel'],
          item['ticketDate'],
          item['ticketId'],
          'Tickety',
          item['shortcode'],
        ];
      })
      .value();

    var _url = config.surway.base_url + (
        /\/$/.test(config.surway.base_url)
          ? 'services/upload/data'
          : '/services/upload/data'
        );

    utils.log('Sending {num} tickets to Surway'.replace('{num}', data.length))

    return utils.post(_url, data, { Authorization: 'Bearer ' + _token });
  })
  .then(function (res) {
    utils.log('Successfully sent NPS messages and got the response:')
    utils.log(res);
    return quarantineTels(_tickets);
  })
  .then(function (res) {
    var msg = 'Finished sending NPS data to Surway.';
    utils.log(msg)
    utils.cellsyntSMS('Finished sending NPS data to Surway.')
    .catch(function (err) { utils.log('Something went wrong with sending the SMS to clickatell:\n {err}'.replace('{err}', err)); });

    return Promise.resolve(res);
  })
  .catch(function (err) {
    utils.log('The following error occurred when sending NPS data to Surway:')
    utils.log(err);

    utils.cellsyntSMS('Error with NPS:\n{err}'.replace('{err}', err))
    .catch(function (err) { utils.log('Seomthing went wrong with sending the SMS to clickatell:\n {err}'.replace('{err}', err)); });

    return Promise.reject(err);
  })
}

/**
 * Schedules getAndSend method for every thursday at 15:00.
 */
function scheduleNps() {
  utils.log('Adding NPS to schedule.');
  schedule.addToNPSSchedule(getAndSend);
}

scheduleNps();

exports.module = {
  getAndSend: getAndSend,
  sendSurway: sendSurway,
}