'use strict'

var express = require('express');
var controller = require('./file.controller');
var path = require('path');
var multer = require('multer');

var assetsFolder = path.resolve(__dirname, '../../assets/uploads');

var fs = require('fs');

var upload = multer({ dest: assetsFolder });

var auth = require('../../services/auth');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.get);
router.post('/', auth.isAuthenticated(), upload.any(), controller.post);

module.exports = router;