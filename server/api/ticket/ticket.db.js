'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var moment = require('moment');

var utils = require('../../utils/utils');

/**
 * TODO:
 * - Create custom db call for dashboard
 */

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/ticket.initialize.sql')
  })
    .then(function (result) {
      utils.log('Ticket table all set up.');
    })
    .catch(function (err) {
      utils.log('Couldn\'t set up Ticket table.');
      utils.log(err);
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

  /**
   * TODO:
   * - Speed this up tremendously
   */

  var query = sql.fromFile('./sql/ticket.findBy.sql')
    .replace(utils.literalRegExp('{ where_clause }', 'gi'), '[{paramName}] = @{paramName}')
    .replace(utils.literalRegExp('{paramName}', 'gi'), paramName)
    .replace(utils.literalRegExp('{ other }', 'gi'), other);

  // Allows for pagination.
  return _.isUndefined(top)
    ? query
    : [
      query,
      ['OFFSET', (offset || 0), 'ROWS', 'FETCH NEXT', top, 'ROWS ONLY'].join(' '),
      (!!multiple ? 'SELECT COUNT(*) FROM [dbo].[Ticket] WHERE { where_clause }' : '')
        .replace(utils.literalRegExp('{ where_clause }', 'gi'), '[{paramName}] = @{paramName}')
        .replace(utils.literalRegExp('{paramName}', 'gi'), paramName)
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
    name: { // Member of Person, but may be created
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
      val: ticket.subcategory.subcategoryId || ticket.subcategoryId
    },
    descriptorId: {
      type: sql.BIGINT,
      val: ticket.descriptor.descriptorId || ticket.descriptorId
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
      val: ticket.product.productId || ticket.productId
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
      return reject(new Error('No ticket provided.'))
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
        resolve(_.first(utils.objectify(ticket)));
      })
      .catch(function (err) {
        utils.log(err);
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
        resolve(_.first(utils.objectify(ticket)));
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
        resolve(_.first(utils.objectify(tickets)));
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
            ? [utils.objectify(data[0]), data[1][0]['']]
            : utils.objectify(data)
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
        resolve(utils.objectify(tickets));
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
      resolve(utils.objectify(tickets));
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

    console.log('\n\n\n')
    console.log(findBy('userId', undefined, top, offset))
    console.log('\n\n\n')

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
        resolve(utils.objectify(tickets));
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
 * Gets the SQL type and val of *val*,
 * in the format Seriate wants.
 *
 * Example output: { type: [sql.BIGINT], val: 27861523 }
 *
 * @param {Any} val
 * @return {Object}
 */
function getTypeAndVal(val) {

  var _type;

  if (_.isDate(val)) {
    _type = sql.DATETIME2;
  } else if (_.isNumber(val)) {
    _type = sql.BIGINT;
  } else if (/^(true|false)$/.test(val)) {
    val = utils.parseBool(val);
    _type = sql.BIT;
  } else {
    _type = sql.VARCHAR;
  }

  return {
    type: _type,
    val: val
  };

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
exports.findNps = function (top, page, filter, value, options) {
  return new Promise(function (resolve, reject) {

    // Ensure there's a top
    if (top < 1 || _.isUndefined(top)) { top = 20; }
    // Ensure there's a page
    if (page < 1 || _.isUndefined(page)) { page = 1; }

    var offset = (page - 1) * top;

    var opts = _.pick(options, ['userId', 'customerId', 'isClosed', 'groupingCountry']);

    // Set isCLosed to true, false or undefined (undefined if it's neither);
    opts.isClosed = /^true$/i.test(opts.isClosed)
      ? true
      : /^false$/i.test(opts.isClosed) ? false : undefined;

    var query = sql.fromFile('./sql/ticket.findCallBack.sql');

    var params = {
      top: {
        type: sql.BIGINT,
        val: top,
      },
      offset: {
        type: sql.BIGINT,
        val: offset,
      },
      userId: {
        type: sql.BIGINT,
        val: opts.userId,
      },
      customerId: {
        type: sql.BIGINT,
        val: opts.customerId,
      },
      isClosed: {
        type: sql.BIT,
        val: opts.isClosed,
      },
      groupingCountry: {
        type: sql.VARCHAR,
        val: opts.groupingCountry,
      }
    };

    var definitions = {
      userId: '[callBackUserId] = @userId',
      customerId: '[customerId] = @customerId',
      /**
       * FIX THIS FOR NULL VALUES
       */
      isClosed: " ( \
        SELECT CASE \
          WHEN @isClosed = 1 AND [callBackIsClosed] = @isClosed THEN 1 \
          WHEN @isClosed = 0 AND ([callBackIsClosed] = @isClosed OR [callBackIsClosed] IS NULL) THEN 1\
          ELSE 0 \
        END \
        ) = 1\
      ",
      groupingCountry: " \
        ( \
        SELECT CASE \
          WHEN [tel] LIKE '45%' THEN 'DK' \
          WHEN [tel] LIKE '47%' THEN 'NO' \
          WHEN [tel] LIKE '358%' THEN 'FI' \
          ELSE 'SE' \
        END \
        ) = @groupingCountry \
      ",
    }

    var filters = _.chain(opts)
      .map(function (val, key) { return { key: key, val: val } })
      .filter(function (item) { return !_.isUndefined(item.val) || item.val !== ''; })
      .map(function (item) { return definitions[item.key]; })
      .value()
      .join(' AND ');
    if (!!filters) { filters = 'AND ' + filters; }

    query = query.replace(/\{filter\}/g, filters);

    sql.execute({
      query: query,
      params: params,
      multiple: true
    })
      .then(function (tickets) {
        resolve({ tickets: utils.objectify(_.first(tickets)), ticketCount: tickets[1][0][''] });
      })
      .catch(function (err) {
        utils.log(err);
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

/**
 * @param {Number} userId
 * @param {{ page: Number, top: Number, order: String }} options
 * @return {Promise<{}[]>}
 */
exports.findDashboard = function (userId, options) {
  /** @type {{ page: Number, top: Number, userId: Number, order: String }} */
  var _options = _.assign({}, { page: 1, top: 20, order: 'DESC' }, options);

  var _page = _options.page < 1 ? 1 : _options.page;
  var _top = _options.top >= 1 ? _options.top : 20;
  var _offset = (_page - 1) * _top;

  var _sortOrder = /^(asc|desc)$/i.test(_options.order) ? _options.order : 'DESC';

  var _queryParams = {
    offset: {
      type: sql.BIGINT,
      val: _offset,
    },
    top: {
      type: sql.BIGINT,
      val: _top,
    },
    userId: {
      type: sql.BIGINT,
      val: userId,
    },
  };

  return sql.execute({
    query: sql.fromFile('./sql/ticket.findDashboard.sql')
      .replace(/\{\{(\s*)sort_order(\s*)\}\}/ig, _sortOrder),
    params: _queryParams,
    multiple: true,
  })
  .then(function (data) {
    return Promise.resolve({
      tickets: utils.objectify(data[0]),
      statusInfo: utils.objectify(data[1]),
      totalCount: data[2][0].totalCount,
    });
  })
  .catch(Promise.reject)

}

// Initialize the table
initialize();