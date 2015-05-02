var EventEmitter = require('events').EventEmitter;
var EventManager = require('../build/lib/index');
var helpers = require('./helpers');

var emitter;
var manager;

module.exports = {
  setUp: function (callback) {
    emitter = new EventEmitter();
    manager = new EventManager();
    callback();
  },

  testAttached: function (test) {
    manager.attach();
    manager.detach();

    test.equal(manager.attached, false);
    test.done();
  },
  
  testDetachingHandlers: function (test) {
    var handled = false;
    manager.register(emitter, 'event', function () {
      handled = true;
    });
    manager.attach();
    manager.detach();

    emitter.emit('event');

    test.equal(handled, false);
    test.done();
  }
};
