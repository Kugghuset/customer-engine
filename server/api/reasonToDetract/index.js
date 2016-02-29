'use strict'

var express = require('express');
var controller = require('./reasonToDetract.controller');

var router = express.Router();

router.get('/', controller.getAll);

module.exports = router;