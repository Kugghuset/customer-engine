'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');

var util = require('../../utils/utils');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/ticket.initialize.sql')
  });
}

/**
 * Ensures all properties atleast exists
 * to ensure no undefined exceptions are thrown.
 * 
 * @param {Object} ticket
 * @return {Object} (Ticket)
 */
function ensureHasProps(ticket, user) {
    // Ensure properties which are objects are defined
    ticket.customer = ticket.customer || {};
    ticket.user = ticket.user || user || {};
    ticket.category = ticket.category || {};
    ticket.subcategory = ticket.subcategory || {};
    ticket.descriptor = ticket.descriptor || {};
    ticket.department = ticket.department || {};
    ticket.country = _.isObject(ticket.country) ? ticket.country.short : ticket.country
    
    return ticket;
}


function findBy(paramName, other) {
  if (!other) { other = ''; }
  return sql.fromFile('./sql/ticket.findBy.sql')
  .replace(util.literalRegExp('{ where_clause }', 'gi'), '[{paramName}] = @{paramName}')
  .replace(util.literalRegExp('{paramName}', 'gi'), paramName)
  .replace(util.literalRegExp('{ other }', 'gi'), other);
}

/**
 * @param {Object} ticket
 * @reruturn {Object} params object for seriate
 */
function ticketParams(ticket, extra) {
  return _.assign({
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
    altTel: {
      type: sql.VARCHAR(256),
      val: ticket.altTel
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
    status: {
      type: sql.VARCHAR(256),
      val: ticket.status
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
    subcategoryId: {
      type: sql.BIGINT,
      val:  ticket.subcategory.subcategoryId
    },
    descriptorId: {
      type: sql.BIGINT,
      val: ticket.descriptor.descriptorId
    },
    departmentId: {
      type: sql.BIGINT,
      val: ticket.department.departmentId
    },
    isSubmitted: {
      type: sql.BIT,
      val: ticket.isSubmitted
    }
  }, extra);
}

/**
 * @param {Object} ticket
 * @param {Object} user - optional
 * @return {Promise} -> {Object} (Ticket)
 */
exports.create = function (ticket, user) {
  return new Promise(function (resolve, reject) {
    if (!_.isObject(ticket)) {
      // No ticket!
      return  reject(new Error('No ticket provided.'))
    }
    
    // Ensure there are properties
    ticket = ensureHasProps(ticket, user);
    
    return sql.execute({
      query: [
        sql.fromFile('./sql/ticket.create.sql'),
        findBy('ticketId')
        ].join(' '),
      params: ticketParams(ticket)
    })
    .then(function (ticket) {
      resolve(_.first(util.objectify(ticket)));
    })
    .catch(function (err) {
      reject(err);
    });
  });
}

/**
 * Updates the ticket in the db.
 * 
 * @param {Object} ticket
 * @return {Promise} -> {Object} (Ticket)
 */
exports.update = function (ticket, user) {
  return new Promise(function (resolve, reject) {
    if (!ticket) { return reject(new Error('No provided ticket')); }
    
    // Ensure there are properties
    ticket = ensureHasProps(ticket, user);
    
    sql.execute({
      query: [
        sql.fromFile('./sql/ticket.update.sql'),
        findBy('ticketId')
      ].join(' '),
      params: ticketParams(ticket, {
        ticketId: {
          type: sql.BIGINT,
          val: ticket.ticketId
        }
      })
    })
    .then(function (ticket) {
      resolve(_.first(util.objectify(ticket)));
    })
    .catch(function (err) {
      reject(err);
    });
  });
}

exports.createOrUpdate = function (ticket, user) {
  return new Promise(function (resolve, reject) {
    if (!ticket) { return reject(new Error('No provided ticket')); }
    
    if (ticket.ticketId) {
      this.update(ticket, user)
      .then(resolve)
      .catch(reject);
    } else {
      this.create(ticket, user)
      .then(resolve)
      .catch(reject);
    }
  }.bind(this));
}

exports.findById = function (ticketId) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: findBy('ticketId'),
      params: {
        ticketId: {
          type: sql.BIGINT,
          val: ticketId
        }
      }
    })
    .then(function (tickets) {
      resolve(_.first(util.objectify(tickets)));
    })
    .catch(function (err) {
      reject(err);
    })
  });
}

exports.findByCustomerId = function (customerId) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: findBy('customerId'),
      params: {
        customerId: {
          type: sql.BIGINT,
          val: customerId
        }
      }
    })
    .then(function (tickets) {
      resolve(util.objectify(tickets));
    })
    .catch(function (err) {
      reject(err);
    });
  });
}

exports.findByUserId = function (userId) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: findBy('userId'),
      params: {
        userId: {
          type: sql.BIGINT,
          val: userId
        }
      }
    })
    .then(function (tickets) {
      resolve(util.objectify(tickets));
    })
    .catch(function (err) {
      reject(err);
    });
  });
}

exports.findNonSubmitted = function (userId) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: findBy('userId', 'AND ([A].[isSubmitted] IS NULL OR [A].[isSubmitted] = 0)'),
      params: {
        userId: {
          type: sql.BIGINT,
          val: userId
        }
      }
    })
    .then(function (tickets) {
      resolve(util.objectify(tickets));
    })
    .catch(function (err) {
      reject(err);
    });
  });
}

// Initialize the table
initialize();