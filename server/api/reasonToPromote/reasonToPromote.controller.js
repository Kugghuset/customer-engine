'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');

var ReasonToPromote = require('./reasonToPromote.db');
var utils = require('../../utils/utils');


/**
 * ROUTE: GET '/api/callBacks/'
 */
exports.getAll = function (req, res) {
  
  ReasonToPromote.getAll()
  .then(function (reasonsToPromote) {
    res.status(200).json(reasonsToPromote);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}
