'use strict'

var express = require('express');
var path = require('path');
var morgan = require('morgan');

var root = path.resolve();

// Init category stuff
require('./category/index')
require('./categoryBlob/index')
require('./subcategory/index')
require('./descriptor/index')

/**
 * Purely the routing module.
 * Inserts routes like:
 * app.use('/name', require('./name'));
 */
module.exports = function (app, logger) {
  // Front end app
  app.use(express.static(root + '/public'));
  
  // Logging for API routes
  app.use(morgan('combined', { stream: logger.stream }));
  
  // Insert modules/routes here
  app.use('/api/users', require('./user/index'));
  app.use('/api/customers', require('./customer/index'));
  app.use('/api/tickets', require('./ticket/index'));
  app.use('/api/categories', require('./category/index'));
  app.use('/api/departments', require('./department/index'));
  app.use('/api/products', require('./product/index'));
  app.use('/api/persons', require('./person/index'));
  app.use('/api/npsResponse', require('./npsResponse/index'));
};