'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ThingSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

exports['default'] = mongoose.model('Thing', ThingSchema);
module.exports = exports['default'];
//# sourceMappingURL=thing.model.js.map
