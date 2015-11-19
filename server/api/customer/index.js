'use strict'

var express = require('express');
var controller = require('./customer.controller');

var auth = require('../../services/auth');

var router = express.Router();

router.put('/fuzzy', auth.isAuthenticated(), controller.fuzzyQuery);

module.exports = router;