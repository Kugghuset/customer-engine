'use strict'

var express = require('express');
var controller = require('./customer.controller');

var auth = require('../../services/auth');

var router = express.Router();

router.put('/fuzzy', auth.isAuthenticated(), controller.fuzzyQuery);
router.put('/fuzzy/:colName', auth.isAuthenticated(), controller.fuzzyQueryBy);
router.post('/', auth.isAuthenticated(), controller.create);

module.exports = router;