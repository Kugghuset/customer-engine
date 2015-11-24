'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');

var Ticket = require('./ticket.db');

/**
 * ROUTE: POST '/api/tickets'
 */
exports.create = function (req, res) {
  Ticket.create(req.body, req.user)
  .then(function (ticket) {
    res.status(200).json(ticket);
  })
  .catch(function (err) {
    handleError(res, err);
  })
}

/**
 * ROUTE: GET '/api/tickets/:id'
 */
exports.findById = function (req, res) {
  Ticket.findById(req.params.id)
  .then(function (ticket) {
    res.status(200).json(ticket);
  })
  .catch(function (err) {
    handleError(res, err);
  });
}

function handleError(res, err) {
  console.log(chalk.red(err));
  res.status(500).send('Internal Error');
};