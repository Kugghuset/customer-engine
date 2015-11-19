'use strict'

var chalk = require('chalk');

var Customer = require('./customer.db');

/**
 * ROUTE: PUT '/api/customers/fuzzy'
 */
exports.fuzzyQuery = function (req, res) {
  Customer.getFuzzy(req.body.query)
  .then(function (customers) {
    res.status(200).json(customers);
  })
  .catch(function (err) {
    handleError(res, err);
  });
}


function handleError(res, err) {
  console.log(chalk.red(err));
  res.status(500).send('Internal Error');
};