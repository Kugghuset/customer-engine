'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');

var Ticket = require('./ticket.db');
var utils = require('../../utils/utils');

/**
 * ROUTE: POST '/api/tickets'
 */
exports.create = function (req, res) {
  Ticket.create(req.body, req.user)
  .then(function (ticket) {
    res.status(200).json(ticket);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  })
}

/**
 * ROUTE: PUT '/api/tickets/'
 */
exports.createOrUpdate = function (req, res) {
  
  if (!req.body) {
    // return early because there's no available ticket.
    return utils.handleError(res, new Error('No ticket provided.'));
  }
  
  Ticket.createOrUpdate(req.body, req.user)
  .then(function (ticket) {
    res.status(200).json(ticket);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  })
}

exports.updateStatus = function (req, res) {
  
  if (!req.body) {
    // Return early because there's no available ticket.
    return utils.handleError(res, new Error('No ticket provided.'));
  }
  
  Ticket.updateStatus(req.body)
  .then(function () {
    res.status(200).send('OK');
  })
  .catch(function (err) {
    utils.handleError(res, err);
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
    utils.handleError(res, err);
  });
}

/**
 * ROUTE: GET '/api/tickets/customer/:id'
 */
exports.findByCustomerId = function (req, res) {
  Ticket.findByCustomerId(req.params.id)
  .then(function (tickets) {
    res.status(200).json(tickets);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  })
}

/**
 * ROUTE: GET '/api/tickets/user/:id'
 */
exports.findByUserId = function (req, res) {
  Ticket.findByUserId(req.params.id)
  .then(function (tickets) {
    res.status(200).json(tickets);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}

/**
 * ROUTE: PUT '/api/tickets/user/:id/fresh'
 */
exports.getFreshByUserId = function (req, res) {
  Ticket.getFreshByUserId(req.params.id)
  .then(function (tickets) {
    res.status(200).json(tickets);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}

exports.remove = function (req, res) {
  Ticket.remove(req.params.id)
  .then(function () {
    res.status(201).send('No content');
  })
  .catch(function (err) {
    utils.handleError(res, err);
  })
}

// ROUTE: GET 'api/tickets/user/:id/:top/:page
exports.paginate = function (req, res) {
  Ticket.paginate(req.params.id, req.params.top, req.params.page)
  .then(function (tickets) {
    res.status(200).json(tickets);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  })
}

/**
 * ROUTE: GET '/api/tickets/user/:id/status'
 */
exports.statusTickets = function (req, res) {
  
  Ticket.statusTickets(req.params.id)
  .then(function (tickets) {
    res.status(200).json(tickets);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  })
  
}