callbackA = function callbackA() {}
callbackB = function callbackB() {}
callbackC = function callbackC() {}

assertManagerState = function assertManagerState(test, manager, registry, handlers) {
  test.deepEqual(manager.registry, registry);
  test.deepEqual(manager.handlers, handlers);
  test.done();
}

