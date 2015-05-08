(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["evtmgr"] = factory();
	else
		root["evtmgr"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _iterator = __webpack_require__(1);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _events = __webpack_require__(2);

	var _events2 = _interopRequireDefault(_events);

	var _ensureArray = __webpack_require__(3);

	var _ensureArray2 = _interopRequireDefault(_ensureArray);

	var _normalizeMap = __webpack_require__(4);

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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ }
/******/ ])
});
;