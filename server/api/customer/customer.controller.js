'use strict'

var chalk = require('chalk');

var Customer = require('./customer.db');
var utils = require('../../utils/utils');

/**
 * ROUTE: PUT '/api/customers/fuzzy'
 */
exports.fuzzyQuery = function (req, res) {
  Customer.getFuzzy(req.body.query)
  .then(function (customers) {
    res.status(200).json(customers);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}
