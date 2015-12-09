'use strict'

var chalk = require('chalk');

var Product = require('./product.db');
var utils = require('../../utils/utils');

/**
 * ROUTE: GET '/api/products/'
 */
exports.getAll = function (req, res) {
  Product.getAll()
  .then(function (products) {
    res.status(200).json(products);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}
