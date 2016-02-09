'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');

var Role = require('./role.db');
var utils = require('../../utils/utils');

exports.getAll = function (req, res) {
  
  Role.getAll()
  .then(function (roles) {
    res.status(200).json(roles);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}