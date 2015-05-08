# evtmgr [![build status](https://img.shields.io/travis/mzabriskie/evtmgr.svg?style=flat-square)](https://travis-ci.org/mzabriskie/evtmgr)

Helper for managing event handlers

## Installing

```bash
$ npm install evtmgr
```

## Overview

Can be used with anything that emits an event:
- `addEventListener`
- `addListener`
- `attachEvent`
- `addEvent`

Specifically useful when:
- Adding/removing handlers on a lifecycle hook
- Adding handlers that use `bind`, and need to be removed
- Conveniently remove all added handlers

##### Example

React provides a good use case.

```js
import React, { Component } from 'react';
import EventManager from 'evtmgr';

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pinned: false
    };

    this.evtmgr = new EventManager();
    this.evtmgr.register(window, 'scroll', this.handleWindowScroll.bind(this));
  }

  componentDidMount() {
    this.evtmgr.attach();
  }

  componentWillUnmount() {
    this.evtmgr.detach();
  }

  handleWindowScroll() {
    this.setState({
      pinned = document.body.scrollTop >= 100
    });
  }

  render() {
    var style = {};
    if (this.state.pinned) {
      style.position = 'fixed';
      style.top = 0;
    } else {
      style.position = 'absolute';
      style.top = 100;
    }

    return (
      <menu style={style}>
        {/*...*/}
      </menu>
    );
  }
}
```

## API

#### `register(obj, type, handler)`
Register an event handler

##### `obj`
An object that emits an event

##### `type`
The event type

##### `handler`
The function that handles the event

##### Example

```js
var EventEmitter = require('events').EventEmitter;
var EventManager = require('evtmgr');
var emitter = new EventEmitter();
var manager = new EventManager();

// Register a single handler
manager.register(emitter, 'someEvent', (e) => {
  console.log('someEvent was fired');
});

// Register handlers for multiple events
manager.register(emitter, {
  insert: (e) => {
    console.log('insert fired');
  },
  update: (e) => {
    console.log('update fired');
  },
  delete: (e) => {
    console.log('delete fired');
  }
});
```

#### `unregister(obj, type, handler)`
Unregister an event handler

##### `obj`
An object that emits an event

##### `type`
The event type

##### `handler`
The function that handles the event

##### Example

```js
var EventEmitter = require('events').EventEmitter;
var EventManager = require('evtmgr');
var emitter = new EventEmitter();
var manager = new EventManager();

function handleFoo() {}
function handleBar() {}

// Register handlers
manager.register(emitter, {
  foo: handleFoo,
  bar: handleBar
});

// Actually, don't want to handle bar
manager.unregister(emitter, 'bar', handleBar);
```

#### `attach`
Attach registered event handlers to the objects for which they handle events

Attaching can only be done once, so subsequent calls will have no effect,
unless `detach` is called.

##### Example

```js
// Registration does nothing until attach is called
manager.register(el, 'click', function () {/*...*/});
manager.attach();
// Now el.click() will be handled
```

#### `detach`
Detach registered event handlers from the objects for which they handle events

##### Example

```js
// Attach all the event handlers
manager.attach();

// Once handlers are no longer wanted
manager.detach();
```

## License

MIT
