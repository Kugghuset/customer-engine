'use strict'

var express = require('express');
var Category = require('./category.db');
var controller = require('./category.controller');

var router = express.Router();

router.get('/combined', controller.getCombined);

module.exports = router;