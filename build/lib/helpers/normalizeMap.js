'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = normalizeMap;

function normalizeMap(type, callback) {
  var map;
  if (typeof type === 'object') {
    map = type;
  } else if (typeof type === 'string' && typeof callback === 'function') {
    map = {};
    map[type] = callback;
  }
  return map;
}

module.exports = exports['default'];