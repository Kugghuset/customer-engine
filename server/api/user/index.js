'use strict'

var express = require('express');
var controller = require('./user.controller');

var auth = require('../../services/auth');

var router = express.Router();

router.put('/', controller.login);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:id', auth.isAuthenticated(), controller.show);

module.exports = router;