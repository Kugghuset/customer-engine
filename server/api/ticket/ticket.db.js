'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');

/**
 * @param {Object} ticket
 * @return {Promise} -> {Object} (Ticket)
 */
exports.create = function (ticket) {
  if (!_.isObject(ticket)) { ticket = { customer: {}, user: {}, category: {} }; }
  
  return sql.execute({
    query: sql.fromFile('./sql/ticket.create.sql'),
    params: {
      customerId: {
        type: sql.BIGINT,
        val: ticket.customer.customerId
      },
      userId: {
        type: sql.BIGINT,
        val: ticket.user.userId
      },
      ticketDate: {
        typ: sql.DATETIME2,
        val: ticket.ticketDate
      },
      summary: {
        type: sql.VARCHAR,
        val: ticket.summary
      },
      country: {
        type: sql.VARCHAR(256),
        val: ticket.country
      },
      categoryId: {
        type: sql.BIGINT,
        val: ticket.category.categoryId
      }
    }
  })
}

module.exports = {}