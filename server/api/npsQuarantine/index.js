'use strict'

var express = require('express');
var NPS = require('./npsQuarantine.db');
var controller = require('./npsQuarantine.controller');

var router = express.Router();

module.exports = router;