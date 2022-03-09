[Documentation](../README.md) › [DebugManager](debugmanager.md)

# Class: DebugManager ‹**EventTypes, Context**›

## Type parameters

▪ **EventTypes**: *EventEmitter.ValidEventTypes*

▪ **Context**: *any*

## Hierarchy

* EventEmitter

  ↳ **DebugManager**

## Implements

* DebugManagerDef

## Index

### Interfaces

* [EventEmitterStatic](../interfaces/debugmanager.eventemitterstatic.md)
* [ListenerFn](../interfaces/debugmanager.listenerfn.md)

### Type aliases

* [ArgumentMap](debugmanager.md#static-argumentmap)
* [EventArgs](debugmanager.md#static-eventargs)
* [EventListener](debugmanager.md#static-eventlistener)
* [EventNames](debugmanager.md#static-eventnames)
* [ValidEventTypes](debugmanager.md#static-valideventtypes)

### Constructors

* [constructor](debugmanager.md#constructor)

### Properties

* [EventEmitter](debugmanager.md#static-eventemitter)
* [prefixed](debugmanager.md#static-prefixed)

### Methods

* [addListener](debugmanager.md#addlistener)
* [emit](debugmanager.md#emit)
* [eventNames](debugmanager.md#eventnames)
* [listenerCount](debugmanager.md#listenercount)
* [listeners](debugmanager.md#listeners)
* [now](debugmanager.md#now)
* [off](debugmanager.md#off)
* [on](debugmanager.md#on)
* [once](debugmanager.md#once)
* [removeAllListeners](debugmanager.md#removealllisteners)
* [removeListener](debugmanager.md#removelistener)

## Type aliases

### `Static` ArgumentMap

Ƭ **ArgumentMap**: *object*

Defined in node_modules/eventemitter3/index.d.ts:109

#### Type declaration:

___

### `Static` EventArgs

Ƭ **EventArgs**: *Parameters‹[EventListener](debugmanager.md#static-eventlistener)‹T, K››*

Defined in node_modules/eventemitter3/index.d.ts:126

___

### `Static` EventListener

Ƭ **EventListener**: *T extends string | symbol ? function : function*

Defined in node_modules/eventemitter3/index.d.ts:117

___

### `Static` EventNames

Ƭ **EventNames**: *T extends string | symbol ? T : keyof T*

Defined in node_modules/eventemitter3/index.d.ts:105

___

### `Static` ValidEventTypes

Ƭ **ValidEventTypes**: *string | symbol | object*

Defined in node_modules/eventemitter3/index.d.ts:103

`object` should be in either of the following forms:
```
interface EventTypes {
  'event-with-parameters': any[]
  'event-with-example-handler': (...args: any[]) => void
}
```

## Constructors

###  constructor

\+ **new DebugManager**(`options`: [ConstructorOptions](../README.md#constructoroptions)): *[DebugManager](debugmanager.md)*

*Defined in [packages/debug-manager/src/main/index.ts:9](https://github.com/badbatch/graphql-box/blob/45189bc/packages/debug-manager/src/main/index.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[DebugManager](debugmanager.md)*

## Properties

### `Static` EventEmitter

▪ **EventEmitter**: *[EventEmitterStatic](../interfaces/debugmanager.eventemitterstatic.md)*

Defined in node_modules/eventemitter3/index.d.ts:131

___

### `Static` prefixed

▪ **prefixed**: *string | boolean*

*Inherited from [DebugManager](debugmanager.md).[prefixed](debugmanager.md#static-prefixed)*

Defined in node_modules/eventemitter3/index.d.ts:9

## Methods

###  addListener

▸ **addListener**‹**T**›(`event`: T, `fn`: EventEmitter.EventListener‹EventTypes, T›, `context?`: Context): *this*

*Inherited from [DebugManager](debugmanager.md).[addListener](debugmanager.md#addlistener)*

Defined in node_modules/eventemitter3/index.d.ts:45

**Type parameters:**

▪ **T**: *EventEmitter.EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |
`fn` | EventEmitter.EventListener‹EventTypes, T› |
`context?` | Context |

**Returns:** *this*

___

###  emit

▸ **emit**(`event`: string | symbol, `data`: PlainObjectMap): *boolean*

*Overrides void*

*Defined in [packages/debug-manager/src/main/index.ts:28](https://github.com/badbatch/graphql-box/blob/45189bc/packages/debug-manager/src/main/index.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |
`data` | PlainObjectMap |

**Returns:** *boolean*

___

###  eventNames

▸ **eventNames**(): *Array‹EventEmitter.EventNames‹EventTypes››*

*Inherited from [DebugManager](debugmanager.md).[eventNames](debugmanager.md#eventnames)*

Defined in node_modules/eventemitter3/index.d.ts:15

Return an array listing the events for which the emitter has registered
listeners.

**Returns:** *Array‹EventEmitter.EventNames‹EventTypes››*

___

###  listenerCount

▸ **listenerCount**(`event`: EventEmitter.EventNames‹EventTypes›): *number*

*Inherited from [DebugManager](debugmanager.md).[listenerCount](debugmanager.md#listenercount)*

Defined in node_modules/eventemitter3/index.d.ts:27

Return the number of listeners listening to a given event.

**Parameters:**

Name | Type |
------ | ------ |
`event` | EventEmitter.EventNames‹EventTypes› |

**Returns:** *number*

___

###  listeners

▸ **listeners**‹**T**›(`event`: T): *Array‹EventEmitter.EventListener‹EventTypes, T››*

*Inherited from [DebugManager](debugmanager.md).[listeners](debugmanager.md#listeners)*

Defined in node_modules/eventemitter3/index.d.ts:20

Return the listeners registered for a given event.

**Type parameters:**

▪ **T**: *EventEmitter.EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |

**Returns:** *Array‹EventEmitter.EventListener‹EventTypes, T››*

___

###  now

▸ **now**(): *number*

*Defined in [packages/debug-manager/src/main/index.ts:35](https://github.com/badbatch/graphql-box/blob/45189bc/packages/debug-manager/src/main/index.ts#L35)*

**Returns:** *number*

___

###  off

▸ **off**‹**T**›(`event`: T, `fn?`: EventEmitter.EventListener‹EventTypes, T›, `context?`: Context, `once?`: undefined | false | true): *this*

*Inherited from [DebugManager](debugmanager.md).[off](debugmanager.md#off)*

Defined in node_modules/eventemitter3/index.d.ts:69

**Type parameters:**

▪ **T**: *EventEmitter.EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |
`fn?` | EventEmitter.EventListener‹EventTypes, T› |
`context?` | Context |
`once?` | undefined &#124; false &#124; true |

**Returns:** *this*

___

###  on

▸ **on**‹**T**›(`event`: T, `fn`: EventEmitter.EventListener‹EventTypes, T›, `context?`: Context): *this*

*Inherited from [DebugManager](debugmanager.md).[on](debugmanager.md#on)*

Defined in node_modules/eventemitter3/index.d.ts:40

Add a listener for a given event.

**Type parameters:**

▪ **T**: *EventEmitter.EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |
`fn` | EventEmitter.EventListener‹EventTypes, T› |
`context?` | Context |

**Returns:** *this*

___

###  once

▸ **once**‹**T**›(`event`: T, `fn`: EventEmitter.EventListener‹EventTypes, T›, `context?`: Context): *this*

*Inherited from [DebugManager](debugmanager.md).[once](debugmanager.md#once)*

Defined in node_modules/eventemitter3/index.d.ts:54

Add a one-time listener for a given event.

**Type parameters:**

▪ **T**: *EventEmitter.EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |
`fn` | EventEmitter.EventListener‹EventTypes, T› |
`context?` | Context |

**Returns:** *this*

___

###  removeAllListeners

▸ **removeAllListeners**(`event?`: EventEmitter.EventNames‹EventTypes›): *this*

*Inherited from [DebugManager](debugmanager.md).[removeAllListeners](debugmanager.md#removealllisteners)*

Defined in node_modules/eventemitter3/index.d.ts:79

Remove all listeners, or those of the specified event.

**Parameters:**

Name | Type |
------ | ------ |
`event?` | EventEmitter.EventNames‹EventTypes› |

**Returns:** *this*

___

###  removeListener

▸ **removeListener**‹**T**›(`event`: T, `fn?`: EventEmitter.EventListener‹EventTypes, T›, `context?`: Context, `once?`: undefined | false | true): *this*

*Inherited from [DebugManager](debugmanager.md).[removeListener](debugmanager.md#removelistener)*

Defined in node_modules/eventemitter3/index.d.ts:63

Remove the listeners of a given event.

**Type parameters:**

▪ **T**: *EventEmitter.EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |
`fn?` | EventEmitter.EventListener‹EventTypes, T› |
`context?` | Context |
`once?` | undefined &#124; false &#124; true |

**Returns:** *this*
