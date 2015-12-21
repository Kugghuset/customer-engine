'use strict'

var express = require('express');
var controller = require('./user.controller');

var auth = require('../../services/auth');

var router = express.Router();

router.put('/', controller.login);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.put('/:id', auth.isAuthenticated(), controller.update)
router.put('/:id/password', auth.isAuthenticated(), controller.setPassword);

module.exports = router;