/**
 * Bic model events
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var Bic = require('./bic.model');
var BicEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
BicEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Bic.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    BicEvents.emit(event + ':' + doc._id, doc);
    BicEvents.emit(event, doc);
  };
}

exports['default'] = BicEvents;
module.exports = exports['default'];
//# sourceMappingURL=bic.events.js.map
