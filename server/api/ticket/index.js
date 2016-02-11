'use strict'

var express = require('express');
var controller = require('./ticket.controller');

var auth = require('../../services/auth');

var router = express.Router();

router.post('/', auth.isAuthenticated(), controller.create);
router.put('/', auth.isAuthenticated(), controller.createOrUpdate);
router.put('/status/', auth.isAuthenticated(), controller.updateStatus);
router.get('/:id', auth.isAuthenticated(), controller.findById);
router.delete('/:id', auth.isAuthenticated(), controller.remove);
router.get('/customer/:id', auth.isAuthenticated(), controller.findByCustomerId);
router.get('/customer/:id/:top/:page', auth.isAuthenticated(), controller.findByCustomerId);
router.get('/user/:id', auth.isAuthenticated(), controller.findByUserId);
router.get('/user/:id/fresh', auth.isAuthenticated(), controller.getFreshByUserId);
router.get('/user/:id/:top/:page', auth.isAuthenticated(), controller.paginate);
router.get('/user/:id/status', auth.isAuthenticated(), controller.statusTickets);
router.get('/nps/:top/:page', auth.isAuthenticated(), controller.findNps)
router.get('/nps/:filter/:value/:top/:page', auth.isAuthenticated(), controller.findNps)

module.exports = router;