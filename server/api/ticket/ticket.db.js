'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var moment = require('moment');

var util = require('../../utils/utils');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/ticket.initialize.sql')
  })
  .then(function (result) {
    console.log('Ticket table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up Ticket table.');
    console.error(err);
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
    ticket.transferredDepartment = ticket.transferredDepartment || {};
    ticket.country = ticket.country || {};
    ticket.product = ticket.product || {};
    ticket.person = ticket.person || {};
    
    return ticket;
}

/**
 * Returns the query for finding tickets by specific criteria.
 * 
 * @param {String} paramName
 * @param {Object} other
 * @param {Number} top
 * @param {Number} offset
 * @return {String}
 */
function findBy(paramName, other, top, offset, multiple) {
  if (!other) { other = ''; }
  
  var query = sql.fromFile('./sql/ticket.findBy.sql')
  .replace(util.literalRegExp('{ where_clause }', 'gi'), '[{paramName}] = @{paramName}')
  .replace(util.literalRegExp('{paramName}', 'gi'), paramName)
  .replace(util.literalRegExp('{ other }', 'gi'), other);
  
  // Allows for pagination.
  return _.isUndefined(top)
    ? query
    : [
        query,
        ['OFFSET', (offset || 0), 'ROWS', 'FETCH NEXT', top, 'ROWS ONLY'].join(' '),
        (!!multiple ? 'SELECT COUNT(*) FROM [dbo].[Ticket] WHERE { where_clause }' : '')
          .replace(util.literalRegExp('{ where_clause }', 'gi'), '[{paramName}] = @{paramName}')
          .replace(util.literalRegExp('{paramName}', 'gi'), paramName)
      ].join('\n');
}

/**
 * Returns an object of all params regarding the ticket
 * in question.
 * 
 * @param {Object} ticket
 * @reruturn {Object} params object for seriate
 */
function ticketParams(ticket, extra) {
  return _.assign({
    ticketDate: {
      type: sql.DATETIME2,
      val: ticket.ticketDate
    },
    ticketDateClosed: {
      type: sql.DATETIME2,
      val: ticket.ticketDateClosed
    },
    personId: {
      type: sql.BIGINT,
      val: ticket.person ? (ticket.person.personId || null) : null // NULL or the value if it exists
    },
    name:  { // Member of Person, but may be created
      type: sql.VARCHAR(256),
      val: ticket.person ? ticket.person.name : ticket.name
    },
    email: { // Member of Person, but may be created
      type: sql.VARCHAR(256),
      val: ticket.person
        ? (ticket.person.email ? ticket.person.email.toLowerCase() : ticket.person.email)
        : ticket.email ? ticket.email.toLowerCase() : ticket.email
    },
    tel: { // Member of Person, but may be created
      type: sql.VARCHAR(256),
      val: ticket.person ? ticket.person.tel : ticket.tel
    },
    altTel: { // Member of Person, but may be created
      type: sql.VARCHAR(256),
      val: ticket.person ? ticket.person.altTel : ticket.altTela
    },
    countryShort: {
      type: sql.VARCHAR(256),
      val: ticket.country.short
    },
    countryFull: {
      type: sql.VARCHAR(256),
      val: ticket.country.full || ticket.country.name
    },
    summary: {
      type: sql.VARCHAR,
      val: ticket.summary
    },
    transferred: {
      type: sql.BIT,
      val: ticket.transferred
    },
    status: {
      type: sql.VARCHAR(256),
      val: ticket.status
    },
    isReseller: {
      type: sql.BIT,
      val: ticket.isReseller
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
      val: ticket.category.categoryId || ticket.categoryId
    },
    subcategoryId: {
      type: sql.BIGINT,
      val:  ticket.subcategory.subcategoryId || ticket.subcategoryId
    },
    descriptorId: {
      type: sql.BIGINT,
      val: ticket.descriptor.descriptorId ||ticket.descriptorId
    },
    departmentId: {
      type: sql.BIGINT,
      val: ticket.department.departmentId
    },
    transferredDepartmentId: {
      type: sql.BIGINT,
      val: ticket.transferredDepartment.departmentId
    },
    productId: {
      type: sql.BIGINT,
      val: ticket.product.productId ||ticket.productId
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
    
    var createQuery = [
        sql.fromFile('./sql/ticket.create.sql')
          .replace('{updateOrCreate}', sql.fromFile('../person/sql/person.owned.sql')),
        findBy('ticketId')
        ].join(' ');
        
    return sql.execute({
      query: createQuery,
      params: ticketParams(ticket)
    })
    .then(function (ticket) {
      resolve(_.first(util.objectify(ticket)));
    })
    .catch(function (err) {
      console.log(err);
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
    
    var updateQuery = [
        sql.fromFile('./sql/ticket.update.sql')
          .replace('{updateOrCreate}', sql.fromFile('../person/sql/person.owned.sql')),
        findBy('ticketId')
      ].join(' ')
    
    sql.execute({
      query: updateQuery,
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

exports.updateStatus = function (ticket) {
  return new Promise(function (resolve, reject) {
    if (!ticket || !ticket.ticketId) { return reject(new Error('No provided ticket')); }
    
    sql.execute({
      query: sql.fromFile('./sql/ticket.updateStatus.sql'),
      params: {
        ticketId: {
          type: sql.BIGINT,
          val: ticket.ticketId,
        },
        status: {
          type: sql.VARCHAR(256),
          val: ticket.status,
        }
      }
    })
    .then(resolve)
    .catch(reject);
  });
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

exports.findByCustomerId = function (customerId, top, page) {
  return new Promise(function (resolve, reject) {
    
    // Ensure it's not below 1
    if (page < 1) { page = 1; }
    
    var offset = (page - 1) * top;
    
    sql.execute({
      query: findBy('customerId', undefined, top, offset, !!top),
      params: {
        customerId: {
          type: sql.BIGINT,
          val: customerId
        }
      },
      multiple: !!top
    })
    .then(function (data) {
      // count is on data[1][0]['']
      resolve(
        !!top
          ? [util.objectify(data[0]), data[1][0]['']]
          : util.objectify(data)
      );
      
      resolve();
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

exports.getFreshByUserId = function (userId) {
  
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: findBy(
        'userId',
        'AND [dateUpdated] > @whenUpdated'
      ),
      params: {
        whenUpdated: {
          type: sql.DATETIME2,
          val: moment().subtract(5, 'seconds').toDate()
        },
        userId: {
          type: sql.BIGINT,
          val: userId
        }
      }
    }).then(function (tickets) {
      resolve(util.objectify(tickets));
    })
    .catch(function (err) {
      reject(err);
    });
  });
}

exports.remove = function (ticketId) {
  return sql.execute({
    query: sql.fromFile('./sql/ticket.remove.sql'),
    params: {
      ticketId: {
        type: sql.BIGINT,
        val: ticketId
      }
    }
  });
}

/**
 * Gets all tickets belonging to the user with *userId*
 * from the page to the top
 * 
 * @param {String} userId
 * @param {Number} top
 * @param {Number} page
 * @return {Promise} -> {Array} (Ticket)
 */
exports.paginate = function (userId, top, page) {
  return new Promise(function (resolve, reject) {
    
    // Ensure it's not below 1
    if (page < 1) { page = 1; }
    
    var offset = (page - 1) * top;
    
    sql.execute({
      query: findBy('userId', undefined, top, offset),
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

/**
 * Returns only the vitals for the status table.
 * 
 * @param {String} userId
 * @return {Promise} -> {Array}
 */
exports.statusTickets = function (userId) {
  return new Promise(function (resolve, reject) {
  exports.findByUserId(userId)
  .then(function (tickets) {
    resolve(_.map(tickets, function (ticket) {
      return _.pick(ticket, ['ticketId', 'status', 'transferred']);
    }));
  })
  .catch(reject);
  });
}

/**
 * Returns a promise of all nps tickets matchiNG *filter* and *value*
 * if defined, otherwise returns all nps tickets.
 * 
 * nps tickets are tickets which are tied to nps results.
 * 
 * @param {String} filter
 * @param {String} value
 * @param {Promise} -> {Object}
 */
exports.findNps = function (top, page, filter, value) {
  return new Promise(function (resolve, reject) {
    
    // Ensure there's a top
    if (top < 1 || _.isUndefined(top)) { top = 20; }
    // Ensure there's a page
    if (page < 1 || _.isUndefined(page)) { page = 1; }
    
    var offset = (page - 1) * top;
    
    var query = sql.fromFile('./sql/ticket.findNps.sql');
    
    sql.execute({
      query: query,
      params: {
        top: {
          type: sql.BIGINT,
          val: top
        },
        offset: {
          type: sql.BIGINT,
          val: offset
        }
      },
      multiple: true
    })
    .then(function (tickets) {
      
      resolve({ tickets: util.objectify(_.first(tickets)), ticketCount: tickets[1][0][''] });
    })
    .catch(function (err) {
      console.log(err);
      reject(err);
    });
    
  });
}

/**
 * Returns the filecontents of the SQL file matching *filename*.
 * NOTE: *filename* should be only the name of the file,
 * E.G. 'ticket.findBy.sql' or 'ticket.update.sql'
 * 
 * @param {String} filename
 * @returm {String}
 */
exports.rawSqlFile = function (filename) {
  return sql.fromFile('./sql/' + filename);
}

/**
 * Returns an object of all params regarding the ticket
 * in question.
 * 
 * @param {Object} ticket
 * @reruturn {Object} params object for seriate
 */
exports.ticketParams = ticketParams;

/**
 * Ensures all properties atleast exists
 * to ensure no undefined exceptions are thrown.
 * 
 * @param {Object} ticket
 * @return {Object} (Ticket)
 */
exports.ensureHasProps = ensureHasProps;

// Initialize the table
initialize();