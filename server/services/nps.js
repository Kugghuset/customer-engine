'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');
var sql = require('seriate')
var moment = require('moment');

var utils = require('../utils/utils');
var Ticket = require('../api/ticket/ticket.db');

function getLastWeek() {
  
  
  var query = Ticket.rawSqlFile('ticket.findBy.sql')
      .replace(new RegExp(
        utils.escapeRegex('{ where_clause }') + '.*'
        , 'gi'), [
          '[ticketDate] < @upperDateLimit',
          'AND [ticketDate] > @lowerDateLimit'
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
  }).then(function (tickets) {
    
    console.log(utils.objectify(tickets));
    
  })
  
}

getLastWeek();

exports.module = {
  
}