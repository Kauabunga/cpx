/**
 * Levy model events
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var Levy = require('./levy.model');
var LevyEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
LevyEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Levy.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    LevyEvents.emit(event + ':' + doc._id, doc);
    LevyEvents.emit(event, doc);
  };
}

exports['default'] = LevyEvents;
module.exports = exports['default'];
//# sourceMappingURL=levy.events.js.map
