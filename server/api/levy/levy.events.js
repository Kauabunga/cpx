/**
 * Levy model events
 */

'use strict';

import {EventEmitter} from 'events';
var Levy = require('./levy.model');
var LevyEvents = new EventEmitter();

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
  return function(doc) {
    LevyEvents.emit(event + ':' + doc._id, doc);
    LevyEvents.emit(event, doc);
  }
}

export default LevyEvents;
