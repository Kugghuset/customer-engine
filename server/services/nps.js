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
 * Finds all tickets which where set to have their ticketDate before three months (minus one day)
 * and their person.tel hasn't been texted the in three months.
 * 
 * @param {Number} numberOfWeeks Defaults to 1
 * @return {Promise} -> {Array}
 */
function getNonQuarantined(numberOfWeeks) {
  return new Promise(function (resolve, reject) {
    
    numberOfWeeks = !_.isUndefined(numberOfWeeks)
      ? numberOfWeeks
      : 1;
    
    console.log(
      '[{timestamp}] Finding callees between the dates: {date1} and {date2}'
        .replace('{timestamp}', moment().format('YYYY-MM-DD HH:mm SSSS ZZ'))
        .replace('{date1}', moment().subtract(numberOfWeeks, 'weeks').startOf('isoweek').format('YYYY-MM-DD HH:mm'))
        .replace('{date2}', moment().subtract(numberOfWeeks, 'weeks').endOf('isoweek').format('YYYY-MM-DD HH:mm'))
      );
    
    var query = Ticket.rawSqlFile('ticket.findReceivers.sql')
    sql.execute({
      query: query,
      params: Ticket.ticketParams(
        Ticket.ensureHasProps({}, {}),
        {
          upperDateLimit: {
            type: sql.DATETIME2,
            val: moment().subtract(numberOfWeeks, 'weeks').endOf('isoweek').toDate()
          },
          lowerDateLimit: {
            type: sql.DATETIME2,
            val: moment().subtract(numberOfWeeks, 'weeks').startOf('isoweek').toDate()
          },
          threeMonthsAgo: {
            type: sql.DATETIME2,
            val: moment().subtract(3, 'months').toDate()
          }
        }
      )
    })
    .then(function (tickets) {
      resolve(utils.objectify(tickets));
    })
    .catch(reject);
  });
}

/**
 * Filters out tickets lacking person.tel and duplice person.tels.
 * 
 * @param {Array} tickets
 * @return {Promise} -> {Array}
 */
function filterUnique(tickets) {
  return new Promise(function (resolve, reject) {
    resolve(
      _.chain(tickets)
        .filter(function (ticket) {
          // Filter out any tickets lacking tels
          return ticket.person && ticket.person.tel;
        })
        .orderBy(function (ticket) { return [ ticket.person.tel, -ticket.ticketId ]; })
        .uniqBy(function (ticket) {
          // Remove any duplicate tels
          return ticket.person.tel;
        })
        .value()
      )
  });
}

/**
 * Gets all numbers (without duplicates)
 * which have been created since the current quarantine started (minus one day)
 * and haven't been texted in three months.
 * 
 * @param {Number} numberOfWeeks Defaults to 1
 * @return {Promise} -> {Array}
 */
function getReceivers(numberOfWeeks) {
  
  numberOfWeeks = !_.isUndefined(numberOfWeeks)
    ? numberOfWeeks
    : 1;
  
  return new Promise(function (resolve, reject) {
    getNonQuarantined(numberOfWeeks)
    .then(filterUnique)
    .then(function (data) {
      
      console.log(
        '[{timestamp}] Found {num} recipients for NPS messages.'
        .replace('{timestamp}', moment().format('YYYY-MM-DD HH:mm SSSS ZZ'))
        .replace('{num}', data.length)
      );
      
      resolve(data);
    })
    .catch(function (err) {
      console.log('[{timestamp}] The following error occured.'.replace('{timestamp}', moment().format('YYYY-MM-DD HH:mm SSSS ZZ')));
      console.log(err);
      reject(err);
    })
  });
}

/**
 * // Sends the messages and inputs it to the db.
 * 
 * @param {Array} tickets
 * @param {Array} sentTickets - Set recursively, do not set.
 * @return {Promise} -> {Array}
 */
function sendMessages(tickets, sentTickets) {
  
  // initiate sentTickets
  if (!sentTickets) { sentTickets = []; }
  
  // Check for finished
  if (!tickets || tickets.length == sentTickets.length) {
    return new Promise(function (resolve, reject) {
      
      console.log(
        '[{timestamp}] Stored {num} entries to NPSSurveyResults table.'
        .replace('{timestamp}', moment().format('YYYY-MM-DD HH:mm SSSS ZZ'))
        .replace('{num}', sentTickets.length)
      );
      
      resolve(sentTickets)
    });
  }
  
  var currentTicket = tickets[sentTickets.length];
  
  return (function () {
    if (config.nps.sendSms) {
      // Actually send the sms if config is set to send
      return utils.getPage(npsUrl(currentTicket))
    } else {
      // Do not send the sms but let the chain follow
      return new Promise(function (resolve, reject) {
        console.log('As config.nps.sendSms is false, not actually making a request to:');
        console.log(npsUrl(currentTicket));
        resolve();
      });
    }
  })()
  .then(function (result) {
    
    // Insert to db
    NpsQuarantine.insert(currentTicket)
    .then(function (ticket) {
      // Recursion!
      return sendMessages(tickets, sentTickets.concat([currentTicket]));
    })
  })
  .catch(function (err) {
    console.log(err);
    // Recursion!
    // Something went wrong with the request, but the show must go on.
    return sendMessages(tickets, sentTickets.concat([undefined]))
  });
}

/**
 * Returns the URL needed to make nps requests
 * 
 * @param {Object} ticket
 * @return {String}
 */
function npsUrl(ticket) {
  return 'http://interactive.intele.com/customersurvey/RequestHandlerServlet?' + [
    'serviceid=' + encodeURIComponent(config.nps.serviceId),
    'queue=' + encodeURIComponent('1'),
    'team=' + encodeURIComponent(ticket.department.departmentName),
    'agentid=' + encodeURIComponent(ticket.ticketId),
    'msisdn=' + encodeURIComponent('+' + ticket.person.tel),
    'password=' + encodeURIComponent(config.nps.password)
  ].join('&')
}

/**
 * Finds all tickets created last week with tels which havenn't been sent out the last three months
 * and sends the sms to them.
 * 
 * @param {Number} numberOfWeeks Defaults to 1
 * @return {Promise} -> {Array}
 */
function getAndSend(numberOfWeeks) {
  
  numberOfWeeks = !_.isUndefined(numberOfWeeks)
    ? numberOfWeeks
    : 1;
  
  console.log('[{timestamp}] Getting and sending NPS messages.'.replace('{timestamp}', moment().format('YYYY-MM-DD HH:mm SSSS ZZ')));
  return getReceivers(numberOfWeeks)
  .then(sendMessages);
}

/**
 * Schedules getAndSend method for every thursday at 15:00.
 */
function scheduleNps() {
  schedule.addToNPSSchedule(getAndSend);
}

scheduleNps();

exports.module = {
  getAndSend: getAndSend
}