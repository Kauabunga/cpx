'use strict';

var express = require('express');
var controller = require('./bic.controller');

var router = express.Router();

router.get('/search/:query', controller.search);
router.get('/', controller.index);

module.exports = router;
