# evtmgr

Helper for managing event handlers

## Installing

```bash
$ npm install evtmgr
```

## API

#### `register(obj, type, handler)`
Register an event handler

##### obj
An object that emits an event

##### type
The event type

##### handler
The function that handles the event

#### `unregister(obj, type, handler)`
Unregister an event handler

##### obj
An object that emits an event

##### type
The event type

##### handler
The function that handles the event

#### `attach`
Attach registered event handlers to the objects for which they handle events

Attaching can only be done once, so subsequent calls will have no effect,
unless `detach` is called.

#### `detach`
Detach registered event handlers from the objects for which they handle events

## License

MIT
