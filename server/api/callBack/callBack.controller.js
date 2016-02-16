'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');

var CallBack = require('./callBack.db');
var utils = require('../../utils/utils');


/**
 * ROUTE: GET '/api/callBacks/'
 */
exports.getAll = function (req, res) {
  
  CallBack.getAll()
  .then(function (callBacks) {
    res.status(200).json(callBacks);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}

/**
 * ROUTE: PUT '/api/callBacks/:id'
 */
exports.set = function (req, res) {
  
  CallBack.set(req.params.id, req.body)
  .then(function (ticket) {
    res.status(200).json(ticket);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
  
}