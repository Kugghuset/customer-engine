'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');
var sql = require('seriate')
var moment = require('moment');

var utils = require('../utils/utils');
var Ticket = require('../api/ticket/ticket.db');

/**
 * Finds all tickets which where created last week.
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
          'AND NOT EXISTS(SELECT * FROM [dbo].[NPSResponse]',
                          'WHERE REPLACE([dbo].[NPSResponse].[npsResponseTel], \'+\', \'\') = [Q].[tel]',
                          'AND ([dbo].[NPSResponse].[npsResponseDate] < @upperDateLimit',
                              'AND [dbo].[NPSResponse].[npsResponseDate] > @lowerDateLimit))'
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
 * Filters out any numbers which have been sent to the previous three months.
 * 
 * @param {Array} tickets
 * @return {Promise} -> {Array}
 */
function filterPrevious(tickets) {
  return new Promise(function (resolve, reject) {
    
    
    
  });
}

getLastWeek()
.then(function (res) {
  return new Promise(function (resolve, reject) {
    console.log(res.length);
    resolve(res);
  });
})
.then(filterUnique)
.then(function (res) {
  return new Promise(function (resolve, reject) {
    console.log(res.length);
    resolve(res);
  });
})
.then(filterPrevious)
.then(function (res) {
  return new Promise(function (resolve, reject) {
    console.log(res.length);
    resolve(res);
  });
})


exports.module = {
  
}