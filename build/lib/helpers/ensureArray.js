"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ensureArray;

function ensureArray(val) {
  if (!Array.isArray(val)) {
    val = [val];
  }
  return val;
}

module.exports = exports["default"];