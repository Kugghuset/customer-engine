'use strict'

var express = require('express');
var controller = require('./customer.controller');

var auth = require('../../services/auth');

var router = express.Router();

router.put('/fuzzy', auth.isAuthenticated(), controller.fuzzyQuery);
router.put('/fuzzy/:colName', auth.isAuthenticated(), controller.fuzzyQueryBy);
router.post('/', auth.isAuthenticated(), controller.create);
router.get('/merge', controller.merge);
router.get('/local', auth.isAuthenticated(), controller.getLocal);
router.get('/local/:top/:page', auth.isAuthenticated(), controller.getLocal);
router.put('/', auth.isAuthenticated(), controller.createOrUpdate);
router.delete('/:id', auth.isAuthenticated(), controller.delete);

module.exports = router;