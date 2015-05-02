"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = iterator;

function iterator(manager, fn) {
  // Iterate each registered object
  for (var i = 0, l = manager.registry.length; i < l; i++) {
    var obj = manager.registry[i];
    // Iterate each entry associated with the object
    for (var type in manager.handlers[i]) {
      if (manager.handlers[i].hasOwnProperty(type)) {
        var items = manager.handlers[i][type];
        // Iterate each event callback associate with the event type
        for (var idx = 0, len = items.length; idx < len; idx++) {
          // Invoke fn
          fn.call(manager, obj, type, items[idx]);
        }
      }
    }
  }
}

module.exports = exports["default"];