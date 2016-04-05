'use strict';

var express = require('express');
var controller = require('./levy.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/calculate/:cuCode/:earnings/:cover', controller.calculate);

module.exports = router;
//# sourceMappingURL=index.js.map
