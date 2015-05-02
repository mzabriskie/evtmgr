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

  testUnregisterIndividually: function (test) {
    manager.register(emitter, 'eventA', callbackA);
    manager.register(emitter, 'eventB', callbackB);
    manager.register(emitter, 'eventC', callbackC);

    manager.unregister(emitter, 'eventB', callbackB);

    assertManagerState(test, manager, [emitter], [{
      'eventA': [callbackA],
      'eventC': [callbackC]
    }]);
  },

  testUnregisterMap: function (test) {
    manager.register(emitter, {
      'eventA': callbackA,
      'eventB': callbackB,
      'eventC': callbackC
    });

    manager.unregister(emitter, {
      'eventA': callbackA,
      'eventC': callbackC
    });

    assertManagerState(test, manager, [emitter], [{
      'eventB': [callbackB],
    }]);
  },

  testUnregisterMultipleCallbacksIndividually: function (test) {
    manager.register(emitter, 'event', callbackA);
    manager.register(emitter, 'event', callbackB);
    manager.register(emitter, 'event', callbackC);

    manager.unregister(emitter, 'event', callbackA);

    assertManagerState(test, manager, [emitter], [{
      'event': [callbackB, callbackC]
    }]);
  },

  testUnregisterMultipleCallbacksMap: function (test) {
    manager.register(emitter, {
      'event': [callbackA, callbackB, callbackC]
    });

    manager.unregister(emitter, {
      'event': [callbackB, callbackC]
    });

    assertManagerState(test, manager, [emitter], [{
      'event': [callbackA]
    }]);
  },

  testUnregisterMultipleEmitters: function (test) {
    var emitterA = new EventEmitter();
    var emitterB = new EventEmitter();
    var emitterC = new EventEmitter();

    manager.register(emitterA, 'eventA', callbackA);
    manager.register(emitterB, 'eventB', callbackB);
    manager.register(emitterC, 'eventC', callbackC);

    manager.unregister(emitterA, 'eventA', callbackA);
    manager.unregister(emitterB, 'eventB', callbackB);

    assertManagerState(test, manager, [emitterC], [
      { 'eventC': [callbackC] }
    ]);
  },

  testUnregisterAfterAttach: function (test) {
    var handled = false;
    function handleEvent() {
      handled = true;
    }

    manager.attach();
    manager.register(emitter, 'event', handleEvent);
    manager.unregister(emitter, 'event', handleEvent);

    emitter.emit('event');

    test.equal(handled, false);
    test.done();
  },

};
