'use strict';

var express = require('express');
var controller = require('./businessnames.controller');

var router = express.Router();

router.get('/:query', controller.search);

module.exports = router;
//# sourceMappingURL=index.js.map
