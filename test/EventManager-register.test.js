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

  testRegisterIndividually: function (test) { 
    manager.register(emitter, 'eventA', callbackA);
    manager.register(emitter, 'eventB', callbackB);
    manager.register(emitter, 'eventC', callbackC);

    assertManagerState(test, manager, [emitter], [{
      'eventA': [callbackA],
      'eventB': [callbackB],
      'eventC': [callbackC]
    }]);
  },

  testRegisterMap: function (test) {
    manager.register(emitter, {
      'eventA': callbackA,
      'eventB': callbackB,
      'eventC': callbackC
    });

    assertManagerState(test, manager, [emitter], [{
      'eventA': [callbackA],
      'eventB': [callbackB],
      'eventC': [callbackC]
    }]);
  },

  testRegisterMultipleCallbacksIndividually: function (test) {
    manager.register(emitter, 'event', callbackA);
    manager.register(emitter, 'event', callbackB);
    manager.register(emitter, 'event', callbackC);

    assertManagerState(test, manager, [emitter], [{
      'event': [callbackA, callbackB, callbackC]
    }]);
  },

  testRegisterMultipleCallbacksMap: function (test) {
    manager.register(emitter, {
      'event': [callbackA, callbackB, callbackC]
    });

    assertManagerState(test, manager, [emitter], [{
      'event': [callbackA, callbackB, callbackC]
    }]);
  },

  testRegisterMultipleEmitters: function (test) {
    var emitterA = new EventEmitter();
    var emitterB = new EventEmitter();
    var emitterC = new EventEmitter();

    manager.register(emitterA, 'eventA', callbackA);
    manager.register(emitterB, 'eventB', callbackB);
    manager.register(emitterC, 'eventC', callbackC);

    assertManagerState(test, manager, [emitterA, emitterB, emitterC], [
      { 'eventA': [callbackA] },
      { 'eventB': [callbackB] },
      { 'eventC': [callbackC] }
    ]);
  },

  testRegisterAfterAttach: function (test) {
    var handled = false;
    manager.attach();
    manager.register(emitter, 'event', function () {
      handled = true;
    });

    emitter.emit('event');

    test.equal(handled, true);
    test.done();
  },

};
