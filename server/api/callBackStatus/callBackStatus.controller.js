'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');

var CallBackStatus = require('./callBackStatus.db');
var utils = require('../../utils/utils');


/**
 * ROUTE: GET '/api/callBacks/'
 */
exports.getAll = function (req, res) {
  
  CallBackStatus.getAll()
  .then(function (callBackStatuses) {
    res.status(200).json(callBackStatuses);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}
