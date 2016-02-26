'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');

var ReasonToDetract = require('./reasonToDetract.db');
var utils = require('../../utils/utils');


/**
 * ROUTE: GET '/api/callBacks/'
 */
exports.getAll = function (req, res) {
  
  ReasonToDetract.getAll()
  .then(function (reasonsToDetract) {
    res.status(200).json(reasonsToDetract);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}
