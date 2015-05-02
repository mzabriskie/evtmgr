'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  addEvent: addEvent,
  removeEvent: removeEvent
};

function addEvent(obj, type, callback) {
  if (typeof obj.addListener === 'function') {
    obj.addListener(type, callback);
  } else if (typeof obj.addEventListener === 'function') {
    obj.addEventListener(type, callback);
  } else if (typeof obj.attachEvent === 'function') {
    obj.attachEvent(type, callback);
  } else if (typeof obj.addEvent === 'function') {
    obj.addEvent(type, callback);
  }
}

function removeEvent(obj, type, callback) {
  if (typeof obj.removeListener === 'function') {
    obj.removeListener(type, callback);
  } else if (typeof obj.removeEventListener === 'function') {
    obj.removeEventListener(type, callback);
  } else if (typeof obj.detachEvent === 'function') {
    obj.detachEvent(type, callback);
  } else if (typeof obj.removeEvent === 'function') {
    obj.removeEvent(type, callback);
  }
}
module.exports = exports['default'];