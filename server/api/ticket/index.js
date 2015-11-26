'use strict'

var express = require('express');
var controller = require('./ticket.controller');

var auth = require('../../services/auth');

var router = express.Router();

router.post('/', auth.isAuthenticated(), controller.create);
router.get('/:id', auth.isAuthenticated(), controller.findById);
router.get('/customer/:id', auth.isAuthenticated(), controller.findByCustomerId);

module.exports = router;