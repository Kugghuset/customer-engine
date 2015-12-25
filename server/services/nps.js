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

/**
 * Finds all tickets which where set to have their ticketDate last week
 * and their person.tel hasn't been texted the in three months.
 * 
 * @return {Promise} -> {Array}
 */
function getLastWeek() {
  return new Promise(function (resolve, reject) {
    
    var query = Ticket.rawSqlFile('ticket.findBy.sql')
      .replace(new RegExp(
        utils.escapeRegex('{ where_clause }') + '.*'
        , 'gi'), [
          '[ticketDate] < @upperDateLimit',
          'AND [A].[ticketDate] > @lowerDateLimit',
          'AND NOT EXISTS(SELECT * FROM [dbo].[NPS]',
                          'WHERE REPLACE([dbo].[NPS].[npsTel], \'+\', \'\') = [Q].[tel]',
                          'AND [dbo].[NPS].[npsDate] > @threeMontshAgo)'
        ].join(' '));
    
    sql.execute({
      query: query,
      params: Ticket.ticketParams(
        Ticket.ensureHasProps({}, {}),
        {
          upperDateLimit: {
            type: sql.DATETIME2,
            val: moment().subtract(1, 'weeks').endOf('week').toDate()
          },
          lowerDateLimit: {
            type: sql.DATETIME2,
            val: moment().subtract(1, 'weeks').startOf('week').toDate()
          },
          threeMontshAgo: {
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
        .uniq(function (ticket) {
          // Remove any duplicate tels
          return ticket.person.tel
        })
        .value()
      )
  });
}

/**
 * Gets all numbers (without duplicates) which have been created last week
 * and haven't been texted in three months.
 * 
 * @return {Promise} -> {Array}
 */
function getReceivers() {
  return getLastWeek().then(filterUnique);
}

/**
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
    NPS.insert(currentTicket)
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
  return encodeURI('http://interactive.intele.com/customersurvey/RequestHandlerServlet?' + [
    'serviceid=' + config.nps.serviceId,
    'queue=1', // Don't know if this is correct
    'agentid=' + ticket.ticketId, // We're using the ticketId instead of the agent's ID
    'msisdn=' + ticket.person.tel,
    'password=' + config.nps.password,
    'customer_key=' + ticket.customer.customerNumber || ticket.customer.orgNr, // Not sure this is correct
    'user_id=' + ticket.user.userId, // probably not correct
    'related_iq_session=' + 'tickety' // most probably not correct
  ].join('&'))
}

/**
 * Finds all tickets created last week with tels which havenn't been sent out the last three months
 * and sends the sms to them.
 * 
 * @return {Promise} -> {Array}
 */
function getAndSend() {
  return getReceivers()
  .then(sendMessages);
}

getAndSend();

exports.module = {
  getAndSend: getAndSend
}