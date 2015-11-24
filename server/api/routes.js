'use strict'

var express = require('express');
var path = require('path');

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
module.exports = function (app) {
  // Front end app
  app.use(express.static(root + '/public'));
  
  // Insert modules/routes here
  app.use('/api/users', require('./user/index'));
  app.use('/api/customers', require('./customer/index'));
  app.use('/api/tickets', require('./ticket/index'));
  app.use('/api/categories', require('./category/index'));
};