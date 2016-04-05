'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var BusinessnamesSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

exports['default'] = mongoose.model('Businessnames', BusinessnamesSchema);
module.exports = exports['default'];
//# sourceMappingURL=businessnames.model.js.map
