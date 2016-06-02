'use strict'

var express = require('express');
var NPS = require('./nps.db');
var controller = require('./nps.controller');
var moment = require('moment');


var router = express.Router();

var _date = new Date();

router.get('/', function (req, res) {
  res.status(200).json({ date: moment(_date).format('YYYY-MM-DD HH:mm') });
});

module.exports = router;