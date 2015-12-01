'use strict'

var chalk = require('chalk');

var Department = require('./department.db');
var utils = require('../../utils/utils');

/**
 * ROUTE: GET '/api/departments/'
 */
exports.getAll = function (req, res) {
  Department.getAll()
  .then(function (departments) {
    res.status(200).json(departments);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}
