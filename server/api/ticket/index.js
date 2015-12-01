'use strict'

var express = require('express');
var controller = require('./ticket.controller');

var auth = require('../../services/auth');

var router = express.Router();

router.post('/', auth.isAuthenticated(), controller.create);
router.put('/', auth.isAuthenticated(), controller.createOrUpdate);
router.get('/:id', auth.isAuthenticated(), controller.findById);
router.get('/customer/:id', auth.isAuthenticated(), controller.findByCustomerId);
router.get('/user/:id', auth.isAuthenticated(), controller.findByUserId);
router.get('/pending/user/:id', auth.isAuthenticated(), controller.findWIP);

module.exports = router;