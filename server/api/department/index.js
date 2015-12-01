'use strict'

var express = require('express');
var controller = require('./department.controller');

var auth = require('../../services/auth');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.getAll);

module.exports = router;