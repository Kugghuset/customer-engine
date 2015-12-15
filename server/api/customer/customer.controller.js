'use strict'

var chalk = require('chalk');

var Customer = require('./customer.db');
var utils = require('../../utils/utils');

/**
 * ROUTE: PUT '/api/customers/fuzzy'
 */
exports.fuzzyQuery = function (req, res) {
  
  // Return quickly for no query
  if (!req.body.query) {
    return res.status(200).json([]);
  }
  
  Customer.getFuzzy(req.body.query)
  .then(function (customers) {
    res.status(200).json(customers);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}

/**
 * ROUTE: PUT '/api/customers/fuzzy/:colName'
 */
exports.fuzzyQueryBy = function (req, res) {
  Customer.getFuzzyBy(req.body.query, req.params.colName)
  .then(function (customers) {
    res.status(200).json(customers);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}


/**
 * ROUTE: POST '/api/customers'
 */
exports.create = function (req, res) {
  Customer.create(req.body)
  .then(function (customer) {
    res.status(200).json(customer);
  })
  .catch(function (err) {
    console.log(err);
    utils.handleError(res, err);
  });
}