'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _iterator = require('./helpers/iterator');

var _iterator2 = _interopRequireDefault(_iterator);

var _events = require('./helpers/events');

var _events2 = _interopRequireDefault(_events);

var _ensureArray = require('./helpers/ensureArray');

var _ensureArray2 = _interopRequireDefault(_ensureArray);

var _normalizeMap = require('./helpers/normalizeMap');

var _normalizeMap2 = _interopRequireDefault(_normalizeMap);

var EventManager = (function () {
  function EventManager() {
    _classCallCheck(this, EventManager);

    /* registry and handlers are parallel Arrays.
     * registry contains a list of all objects that have handlers registered.
     * handlers contains a corresponding list of all events, with their associated handlers.
     *
     * Example:
     *
     * manager.register(emitter, 'event', handleEmitterEvent);
     * console.log(manager.registry); // [emitter]
     * console.log(manager.handlers); // [{'event': [handleEmitterEvent]}]
     */
    this.registry = [];
    this.handlers = [];

    // Whether or not the EventManager has been attached
    this.attached = false;
  }

  _createClass(EventManager, [{
    key: 'register',

    /**
     * Register an event handler
     *
     * @param {object} obj An object that emits an event
     * @param {string} type The event type
     * @param {function} callback The function that handles the event
     */
    value: function register(obj, type, callback) {
      if (!obj) {
        return;
      }

      var index = this.registry.indexOf(obj);
      var entry = null;
      var map = _normalizeMap2['default'](type, callback);
      var attached = this.attached;
      var keys = Object.keys(map);

      // If object has already been registered, get associated entry
      if (index >= 0) {
        entry = this.handlers[index];
      }
      // Otherwise add object to registry and create entry
      else {
        index = this.registry.push(obj) - 1;
        entry = this.handlers[index] = {};
      }

      // Iterate each item in the map
      keys.forEach(function (eventType) {
        // Make sure the entry has a collection for this event type
        if (!entry[eventType]) {
          entry[eventType] = [];
        }

        // Iterate each handler for the type to be added
        var callbackList = _ensureArray2['default'](map[eventType]);
        callbackList.forEach(function (cb) {
          entry[eventType].push(cb);

          // If EventManager instance is already attached add event to object
          if (attached === true) {
            _events2['default'].addEvent(obj, eventType, cb);
          }
        });
      });
    }
  }, {
    key: 'unregister',

    /**
     * Unregister an event handler
     *
     * @param {object} obj An object that emits an event
     * @param {string} type The event type
     * @param {function} callback The function that handles the event
     */
    value: function unregister(obj, type, callback) {
      if (!obj) {
        return;
      }

      var index = this.registry.indexOf(obj);
      var entry = null;
      var map = _normalizeMap2['default'](type, callback);
      var attached = this.attached;
      var keys = Object.keys(map);

      // If object has never been registered return
      if (index === -1) {
        return;
      }

      entry = this.handlers[index];

      // Iterate each item in the map
      keys.forEach(function (eventType) {
        // If event type isn't being handled return
        if (!entry[eventType]) {
          return;
        }

        // Iterate each handler for the type to be removed
        var callbackList = _ensureArray2['default'](map[eventType]);
        callbackList.forEach(function (cb) {
          var idx = entry[eventType].indexOf(cb);
          entry[eventType].splice(idx, 1);

          // If EventManager instance is already attached remove event from object
          if (attached === true) {
            _events2['default'].removeEvent(obj, eventType, cb);
          }
        });

        // If no more callbacks are left, remove from handlers
        if (entry[eventType].length === 0) {
          delete entry[eventType];
        }
      });

      // If no more event types are being handled, release
      if (Object.keys(this.handlers[index]).length === 0) {
        this.registry.splice(index, 1);
        this.handlers.splice(index, 1);
      }
    }
  }, {
    key: 'attach',

    /**
     * Attach registered event handlers to the objects for which they handle events
     *
     * Attaching can only be done once, so subsequent calls will have no effect,
     * unless `detach` is called.
     */
    value: function attach() {
      if (this.attached) {
        return;
      }

      // Add handlers
      _iterator2['default'](this, function (obj, type, callback) {
        _events2['default'].addEvent(obj, type, callback);
      });

      this.attached = true;
    }
  }, {
    key: 'detach',

    /**
     * Detach registered event handlers from the objects for which they handle events
     */
    value: function detach() {
      if (!this.attached) {
        return;
      }

      // Remove handlers
      _iterator2['default'](this, function (obj, type, callback) {
        _events2['default'].removeEvent(obj, type, callback);
      });

      this.attached = false;
    }
  }]);

  return EventManager;
})();

exports['default'] = EventManager;
module.exports = exports['default'];