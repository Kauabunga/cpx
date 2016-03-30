'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var BusinessnamesSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Businessnames', BusinessnamesSchema);
