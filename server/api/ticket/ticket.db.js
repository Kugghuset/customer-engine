'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');

var category = require('../category/category.db');
var subCategory = require('../subCategory/subCategory.db');
var descriptor = require('../descriptor/descriptor.db');
var categoryBlob = require('../categoryBlob/categoryBlob.db');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/ticket.initialize.sql')
  });
}

/**
 * @param {Object} ticket
 * @param {Object} user - optional
 * @return {Promise} -> {Object} (Ticket)
 */
exports.create = function (ticket, user) {
  if (!_.isObject(ticket)) {
    // No ticket!
    return new Promise(function (resolve, reject) {
      reject(new Error('No ticket provided.'))
    });
  }
  
  // Ensure properties which are objects are defined
  ticket.customer = ticket.customer || {};
  ticket.user = ticket.user || user || {};
  ticket.category = ticket.category || {};
  ticket.subCategory = ticket.subCategory || {};
  ticket.descriptor = ticket.descriptor || {};
  
  console.log(ticket);
  
  return sql.execute({
    query: sql.fromFile('./sql/ticket.create.sql'),
    params: {
      ticketDate: {
        type: sql.DATETIME2,
        val: ticket.ticketDate
      },
      name:  {
        type: sql.VARCHAR(256),
        val: ticket.name
      },
      email: {
        type: sql.VARCHAR(256),
        val: ticket.email
      },
      tel: {
        type: sql.VARCHAR(256),
        val: ticket.tel
      },
      country: {
        type: sql.VARCHAR(256),
        val: ticket.country
      },
      summary: {
        type: sql.VARCHAR,
        val: ticket.summary
      },
      transferred: {
        type: sql.BIT,
        val: ticket.transferred
      },
      successful: {
        type: sql.BIT,
        val: ticket.successful
      },
      customerId: {
        type: sql.BIGINT,
        val: ticket.customer.customerId
      },
      userId: {
        type: sql.BIGINT,
        val: ticket.user.userId
      },
      categoryId: {
        type: sql.BIGINT,
        val: ticket.category.categoryId
      },
      subCategoryId: {
        type: sql.BIGINT,
        val:  ticket.subCategory.subCategoryId
      },
      descriptorId: {
        type: sql.BIGINT,
        val: ticket.descriptor.descriptorId
      }
    }
  });
}

// Initialize the table
initialize();