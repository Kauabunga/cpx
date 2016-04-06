'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var LevySchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

exports['default'] = mongoose.model('Levy', LevySchema);
module.exports = exports['default'];
//# sourceMappingURL=levy.model.js.map
