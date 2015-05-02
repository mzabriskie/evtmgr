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
    test.equal(manager.attached, false);

    manager.attach();

    test.equal(manager.attached, true);
    test.done();
  },

  testAttachingHandlers: function (test) {
    var handled = false;
    manager.register(emitter, 'event', function () {
      handled = true;
    });
    manager.attach();

    emitter.emit('event');

    test.equal(handled, true);
    test.done();
  },
 
  testAttachingOnce: function (test) {
    var counter = 0;
    manager.register(emitter, 'event', function () {
      counter++;
    });
    manager.attach();
    manager.attach();

    emitter.emit('event');

    test.equal(counter, 1);
    test.done();
  }
};
