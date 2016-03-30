/**
 * Bic model events
 */

'use strict';

import {EventEmitter} from 'events';
var Bic = require('./bic.model');
var BicEvents = new EventEmitter();

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
  return function(doc) {
    BicEvents.emit(event + ':' + doc._id, doc);
    BicEvents.emit(event, doc);
  }
}

export default BicEvents;
