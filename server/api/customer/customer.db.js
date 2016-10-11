'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');
var os = require('os');

var util = require('../../utils/utils');

var customerFilePath = path.resolve('./server/assets/customers/customers.csv');

function intialize() {
  return new Promise(function (resolve, reject) {

    sql.execute({
      query: sql.fromFile('./sql/customer.initialize.sql')
    })
    .then(function (result) {
      util.log('Customer table all set up.');
      resolve(result)
    })
    .catch(function (err) {
      util.log('Couldn\'t set up Customer table.');
      util.log(err);
      reject(err);
    });
  });
}


/**
 * Fuzzy searches for values matching *query*.
 * (orgNr, orgName, customerNumber)
 *
 * @param {String} query
 * @return {Promise} -> {Array} (Customer)
 */
exports.getFuzzy = function (query) {
  return sql.execute({
    query: sql.fromFile('./sql/customer.getFuzzy.sql'),
    params: {
      query: {
        type: sql.VARCHAR(256),
        val: query
      }
    }
  });
}

/**
 * Fuzzy searches the column at *colName* for values matching *query*.
 *
 * @param {String} query
 * @param {String} colName
 * @return {Promise} -> {Array} (Customer)
 */
exports.getFuzzyBy = function (query, colName) {
  return new Promise(function (resolve, reject) {

    // Get the where statement
    var _whereStatement = /^orgName$/i.test(colName)
      ? "[orgName] LIKE '%' + @query + '%';"
      : "[" + colName + "] = @query";

    var _query = sql.fromFile('./sql/customer.getFuzzyBy.sql')
      .replace(util.literalRegExp('{ colName }', 'gi'), colName)
      .replace(util.literalRegExp('{ where_statement }', 'gi'), _whereStatement);

    return sql.execute({
      query: _query,
      params: {
        query: {
          type: sql.VARCHAR(256),
          val: query
        }
      }
    })
    .then(function (customers) {
      resolve(customers || []);
    })
    .catch(function (err) {
      reject(err);
    });
  });
}

exports.create = function (_customer) {
  return new Promise(function (resolve, reject) {

    sql.execute({
      query: sql.fromFile('./sql/customer.create.sql'),
      params: {
        orgNr: {
          type: sql.VARCHAR(256),
          val: _customer.orgNr
        },
        orgName: {
          type: sql.VARCHAR(256),
          val: _customer.orgName
        },
        customerNumber: {
          type: sql.VARCHAR(256),
          val: _customer.customerNumber
        },
      }
    })
    .then(function (customers) {
      // Get only the first one
      resolve(_.first(customers));
    })
    .catch(function (err) {
      reject(err);
    });
  });
}

exports.getLocal = function (top, page) {

  var query = sql.fromFile('./sql/customer.getLocal.sql');

    // Ensure it's not below 1
    if (page < 1) { page = 1; }

    var offset = (page - 1) * top;

  return new Promise(function (resolve, reject) {
    sql.execute({
      query: query.replace(util.literalRegExp('{ offset }', 'gi'),
        !_.isUndefined(top)
          ?  ['OFFSET', (offset || 0), 'ROWS', 'FETCH NEXT', top, 'ROWS ONLY'].join(' ')
          : ''),
          multiple: true
    })
    .then(function (data) {
      resolve({
        customers: data[0],
        customerCount: data[1][0].customerCount
      })
    })
    .catch(reject);
  });
}

exports.update = function (_customer) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/customer.update.sql'),
      params: {
        customerId: {
          type: sql.BIGINT,
          val: _customer.customerId
        },
        orgNr: {
          type: sql.VARCHAR(256),
          val: _customer.orgNr
        },
        orgName: {
          type: sql.VARCHAR(256),
          val: _customer.orgName
        },
        customerNumber: {
          type: sql.VARCHAR(256),
          val: _customer.customerNumber
        },
      }
    })
    .then(function (customers) {
      resolve(_.first(customers));
    })
    .catch(function (err) {
      if (/illegal update/i.test(err)) {
        return reject(new Error('Illegal update. Cannot update non-local customers'));
      }

      reject(err);
    })
  });
}

exports.createOrUpdate = function (_customer) {
  return new Promise(function (resolve, reject) {
    if (!_customer) {
      return reject(new Error('No provided customer'));
    }

    if (!_customer.customerId) {
      // New customers should be created.
      exports.create(_customer)
      .then(resolve)
      .catch(reject);
    } else {
      // Existing customer should be updated
      exports.update(_customer)
      .then(resolve)
      .catch(reject);
    }
  });
}

exports.delete = function (customerId) {
  return new Promise(function (resolve, reject) {

    sql.execute({
      query: sql.fromFile('./sql/customer.delete.sql'),
      params: {
        customerId: {
          type: sql.BIGINT,
          val: customerId
        }
      }
    })
    .then(function () {
      resolve();
    })
    .catch(function (err) {
      if (/tickets exists/i.test(err)) {
        reject(new Error('Customer cannot be delete because related tickets exists.'));
      } else if (/not local/i.test(err)) {
        reject(new Error('Customer cannot be delete because it is not local.'));
      } else {
        reject(err);
      }
    });
  });
}

function bulkImport() {
  return new Promise(function (resolve, reject) {
    if (!fs.existsSync(customerFilePath)) {
      // No file to import.
      return resolve();
    }

    // Get the actual path to the customers.csv file
    var _query = sql
      .fromFile('./sql/customer.bulkImport.sql')
      .replace('{ filepath }', customerFilePath);

    return sql.execute({
      query: _query
    }).then(function (result) {
      // Do something?
      resolve(result);
    })
    .catch(function (err) {
      // Handle error
      reject(err);
    });
  });
}

/**
 * Merges the customer database on the DW into Tickety.
 * @return {Promise} -> undefined
 */
function merge() {


  if (os.homedir() === 'C:\\Users\\drklu') {
    return new Promise(function (resolve, reject) {
      util.log('Not bulk importing as this is on Kris\'s computer.');
      resolve();
    });
  }

  return sql.execute({
    query: sql.fromFile('./sql/customer.merge.sql')
  });
}

exports.merge = merge;

intialize()
// .then(bulkImport)
// .then(merge)
// .then(function () {
//   util.log('Customer merge finished');
// })
// .catch(function (err) {
//   util.log('Something went wrong with merging customers from BamboraDW.');
//   util.log(err);
// })
