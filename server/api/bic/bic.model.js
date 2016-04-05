'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var BicSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

exports['default'] = mongoose.model('Bic', BicSchema);
module.exports = exports['default'];
//# sourceMappingURL=bic.model.js.map
