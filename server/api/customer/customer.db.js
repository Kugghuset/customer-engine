'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');

var util = require('../../utils/utils');

var customerFilePath = path.resolve('./server/assets/customers/customers.csv');

function intialize() {
  return sql.execute({
    query: sql.fromFile('./sql/customer.initialize.sql')
  })
  .then(function (result) {
    console.log('Customer table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up Customer table.');
    console.error(err);
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
    return sql.execute({
      query: sql.fromFile('./sql/customer.getFuzzyBy.sql').replace(util.literalRegExp('{ colName }', 'gi'), colName),
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

exports.getLocal = function () {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/customer.getLocal.sql')
    })
    .then(resolve)
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
  return sql.execute({
    query: sql.fromFile('./sql/customer.merge.sql')
  });
}

exports.merge = merge;

intialize();
bulkImport()
.then(merge)
.then(function () {
  console.log('Customer merge finished');
})
.catch(function (err) {
  console.log('Something went wrong with merging customers from BamboraDW.');
  console.log(err);
})
