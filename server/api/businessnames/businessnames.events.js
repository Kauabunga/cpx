/**
 * Businessnames model events
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var Businessnames = require('./businessnames.model');
var BusinessnamesEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
BusinessnamesEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Businessnames.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    BusinessnamesEvents.emit(event + ':' + doc._id, doc);
    BusinessnamesEvents.emit(event, doc);
  };
}

exports['default'] = BusinessnamesEvents;
module.exports = exports['default'];
//# sourceMappingURL=businessnames.events.js.map
