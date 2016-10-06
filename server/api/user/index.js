'use strict'

var express = require('express');
var controller = require('./user.controller');

var auth = require('../../services/auth');

var router = express.Router();

router.put('/', controller.login);
router.get('/', controller.get)
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/fuzzy', auth.isAuthenticated(), controller.getFuzzy);
router.get('/as-actual', auth.isAuthenticated(), controller.signInAsActual);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.put('/:id', auth.isAuthenticated(), controller.update)
router.put('/:id/password', auth.isAuthenticated(), controller.setPassword);
router.get('/as-other/:id', auth.isAuthenticated(), controller.signInAs);

module.exports = router;