/**
 * Broadcast updates to client when the model changes
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.register = register;
var BusinessnamesEvents = require('./businessnames.events');

// Model events to emit
var events = ['save', 'remove'];

function register(socket) {
  // Bind model events to socket events
  for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener('businessnames:' + event, socket);

    BusinessnamesEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
}

function createListener(event, socket) {
  return function (doc) {
    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function () {
    BusinessnamesEvents.removeListener(event, listener);
  };
}
//# sourceMappingURL=businessnames.socket.js.map
