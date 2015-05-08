import iterator from './helpers/iterator';
import events from './helpers/events';
import ensureArray from './helpers/ensureArray';
import normalizeMap from './helpers/normalizeMap';

export default class EventManager {
  constructor() {
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

  /**
   * Register an event handler
   *
   * @param {object} obj An object that emits an event
   * @param {string} type The event type
   * @param {function} callback The function that handles the event
   */
  register(obj, type, callback) {
    if (!obj) {
      return;
    }

    var index = this.registry.indexOf(obj);
    var entry = null;
    var map = normalizeMap(type, callback);
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
    keys.forEach((eventType) => {
      // Make sure the entry has a collection for this event type
      if (!entry[eventType]) {
        entry[eventType] = [];
      }

      // Iterate each handler for the type to be added
      var callbackList = ensureArray(map[eventType]);
      callbackList.forEach((cb) => {
        entry[eventType].push(cb);

        // If EventManager instance is already attached add event to object
        if (attached === true) {
          events.addEvent(obj, eventType, cb);
        }
      });
    });
  }

  /**
   * Unregister an event handler
   *
   * @param {object} obj An object that emits an event
   * @param {string} type The event type
   * @param {function} callback The function that handles the event
   */
  unregister(obj, type, callback) {
    if (!obj) {
      return;
    }

    var index = this.registry.indexOf(obj);
    var entry = null;
    var map = normalizeMap(type, callback); 
    var attached = this.attached;
    var keys = Object.keys(map);

    // If object has never been registered return
    if (index === -1) {
      return;
    }

    entry = this.handlers[index];
  
    // Iterate each item in the map
    keys.forEach((eventType) => {
      // If event type isn't being handled return
      if (!entry[eventType]) {
        return;
      }

      // Iterate each handler for the type to be removed
      var callbackList = ensureArray(map[eventType]);
      callbackList.forEach((cb) => {
        var idx = entry[eventType].indexOf(cb);
        entry[eventType].splice(idx, 1);

        // If EventManager instance is already attached remove event from object
        if (attached === true) {
          events.removeEvent(obj, eventType, cb);
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

  /**
   * Attach registered event handlers to the objects for which they handle events
   *
   * Attaching can only be done once, so subsequent calls will have no effect,
   * unless `detach` is called.
   */
  attach() {
    if (this.attached) {
      return;
    }

    // Add handlers
    iterator(this, (obj, type, callback) => {
      events.addEvent(obj, type, callback);
    });

    this.attached = true;
  }

  /**
   * Detach registered event handlers from the objects for which they handle events
   */
  detach() {
    if (!this.attached) {
      return;
    }

    // Remove handlers
    iterator(this, (obj, type, callback) => {
      events.removeEvent(obj, type, callback);
    });

    this.attached = false;
  }
}
