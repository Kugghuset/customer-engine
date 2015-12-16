'use strict'

var chalk = require('chalk');

var Person = require('./person.db');
var utils = require('../../utils/utils');

/**
 * ROUTE: PUT '/api/persons/fuzzy'
 */
exports.fuzzyQuery = function (req, res) {
  Person.getFuzzy(req.body.query)
  .then(function (persons) {
    res.status(200).json(persons);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}

/**
 * ROUTE: PUT '/api/persons/fuzzy'
 */
exports.fuzzyQueryBy = function (req, res) {
  Person.getFuzzyBy(req.body.query, req.params.colName, req.body.customerId)
  .then(function (persons) {
    res.status(200).json(persons);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}


/**
 * ROUTE: POST '/api/persons'
 */
exports.create = function (req, res) {
  Person.create(req.body)
  .then(function (person) {
    res.status(200).json(person);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}

/**
 * ROUTE: GET '/api/persons/:id'
 */
exports.getById = function (req, res) {
  Person.getById(req.params.id)
  .then(function (person) {
    res.status(200).json(person);
  }).catch(function (err) {
    utils.handleError(res, err);
  });
}