'use strict'

var express = require('express');
var controller = require('./callBack.controller');

var router = express.Router();

router.get('/', controller.getAll);
router.put('/:id', controller.set);
router.put('/', controller.set);

module.exports = router;