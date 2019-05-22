[Documentation](../README.md) > [DebugManager](../classes/debugmanager.md)

# Class: DebugManager

## Type parameters
#### EventTypes :  `string` \| `symbol`
## Hierarchy

 `EventEmitter`

**↳ DebugManager**

## Implements

* `DebugManagerDef`

## Index

### Interfaces

* [EventEmitterStatic](../interfaces/debugmanager.eventemitterstatic.md)
* [ListenerFn](../interfaces/debugmanager.listenerfn.md)

### Constructors

* [constructor](debugmanager.md#constructor)

### Properties

* [EventEmitter](debugmanager.md#eventemitter)
* [prefixed](debugmanager.md#prefixed)

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
* [init](debugmanager.md#init)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new DebugManager**(__namedParameters: *`object`*): [DebugManager](debugmanager.md)

*Defined in [main/index.ts:21](https://github.com/bad-batch/handl/blob/20503ed/packages/debug-manager/src/main/index.ts#L21)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| logger | `undefined` \| [Logger](../interfaces/logger.md) |
| name | `string` |
| performance | [Performance](../interfaces/performance.md) |

**Returns:** [DebugManager](debugmanager.md)

___

## Properties

<a id="eventemitter"></a>

### `<Static>` EventEmitter

**● EventEmitter**: *`EventEmitterStatic`*

*Defined in /Users/dylanaubrey/Documents/workspaces/handl/node_modules/eventemitter3/index.d.ts:61*

___
<a id="prefixed"></a>

### `<Static>` prefixed

**● prefixed**: *`string` \| `boolean`*

*Inherited from EventEmitter.prefixed*

*Defined in /Users/dylanaubrey/Documents/workspaces/handl/node_modules/eventemitter3/index.d.ts:6*

___

## Methods

<a id="addlistener"></a>

###  addListener

▸ **addListener**(event: *`EventTypes`*, fn: *`ListenerFn`*, context?: *`any`*): `this`

*Inherited from EventEmitter.addListener*

*Defined in /Users/dylanaubrey/Documents/workspaces/handl/node_modules/eventemitter3/index.d.ts:33*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `EventTypes` |
| fn | `ListenerFn` |
| `Optional` context | `any` |

**Returns:** `this`

___
<a id="emit"></a>

###  emit

▸ **emit**(event: *`string`*, data: *`PlainObjectMap`*): `boolean`

*Overrides EventEmitter.emit*

*Defined in [main/index.ts:30](https://github.com/bad-batch/handl/blob/20503ed/packages/debug-manager/src/main/index.ts#L30)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` |
| data | `PlainObjectMap` |

**Returns:** `boolean`

___
<a id="eventnames"></a>

###  eventNames

▸ **eventNames**(): `Array`<`EventTypes`>

*Inherited from EventEmitter.eventNames*

*Defined in /Users/dylanaubrey/Documents/workspaces/handl/node_modules/eventemitter3/index.d.ts:12*

Return an array listing the events for which the emitter has registered listeners.

**Returns:** `Array`<`EventTypes`>

___
<a id="listenercount"></a>

###  listenerCount

▸ **listenerCount**(event: *`EventTypes`*): `number`

*Inherited from EventEmitter.listenerCount*

*Defined in /Users/dylanaubrey/Documents/workspaces/handl/node_modules/eventemitter3/index.d.ts:22*

Return the number of listeners listening to a given event.

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `EventTypes` |

**Returns:** `number`

___
<a id="listeners"></a>

###  listeners

▸ **listeners**(event: *`EventTypes`*): `Array`<`ListenerFn`>

*Inherited from EventEmitter.listeners*

*Defined in /Users/dylanaubrey/Documents/workspaces/handl/node_modules/eventemitter3/index.d.ts:17*

Return the listeners registered for a given event.

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `EventTypes` |

**Returns:** `Array`<`ListenerFn`>

___
<a id="now"></a>

###  now

▸ **now**(): `number`

*Defined in [main/index.ts:37](https://github.com/bad-batch/handl/blob/20503ed/packages/debug-manager/src/main/index.ts#L37)*

**Returns:** `number`

___
<a id="off"></a>

###  off

▸ **off**(event: *`EventTypes`*, fn?: *`EventEmitter.ListenerFn`*, context?: *`any`*, once?: *`undefined` \| `false` \| `true`*): `this`

*Inherited from EventEmitter.off*

*Defined in /Users/dylanaubrey/Documents/workspaces/handl/node_modules/eventemitter3/index.d.ts:44*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `EventTypes` |
| `Optional` fn | `EventEmitter.ListenerFn` |
| `Optional` context | `any` |
| `Optional` once | `undefined` \| `false` \| `true` |

**Returns:** `this`

___
<a id="on"></a>

###  on

▸ **on**(event: *`EventTypes`*, fn: *`ListenerFn`*, context?: *`any`*): `this`

*Inherited from EventEmitter.on*

*Defined in /Users/dylanaubrey/Documents/workspaces/handl/node_modules/eventemitter3/index.d.ts:32*

Add a listener for a given event.

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `EventTypes` |
| fn | `ListenerFn` |
| `Optional` context | `any` |

**Returns:** `this`

___
<a id="once"></a>

###  once

▸ **once**(event: *`EventTypes`*, fn: *`ListenerFn`*, context?: *`any`*): `this`

*Inherited from EventEmitter.once*

*Defined in /Users/dylanaubrey/Documents/workspaces/handl/node_modules/eventemitter3/index.d.ts:38*

Add a one-time listener for a given event.

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `EventTypes` |
| fn | `ListenerFn` |
| `Optional` context | `any` |

**Returns:** `this`

___
<a id="removealllisteners"></a>

###  removeAllListeners

▸ **removeAllListeners**(event?: *[EventTypes]()*): `this`

*Inherited from EventEmitter.removeAllListeners*

*Defined in /Users/dylanaubrey/Documents/workspaces/handl/node_modules/eventemitter3/index.d.ts:49*

Remove all listeners, or those of the specified event.

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` event | [EventTypes]() |

**Returns:** `this`

___
<a id="removelistener"></a>

###  removeListener

▸ **removeListener**(event: *`EventTypes`*, fn?: *`EventEmitter.ListenerFn`*, context?: *`any`*, once?: *`undefined` \| `false` \| `true`*): `this`

*Inherited from EventEmitter.removeListener*

*Defined in /Users/dylanaubrey/Documents/workspaces/handl/node_modules/eventemitter3/index.d.ts:43*

Remove the listeners of a given event.

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `EventTypes` |
| `Optional` fn | `EventEmitter.ListenerFn` |
| `Optional` context | `any` |
| `Optional` once | `undefined` \| `false` \| `true` |

**Returns:** `this`

___
<a id="init"></a>

### `<Static>` init

▸ **init**(options: *[InitOptions](../#initoptions)*): `Promise`<[DebugManager](debugmanager.md)>

*Defined in [main/index.ts:7](https://github.com/bad-batch/handl/blob/20503ed/packages/debug-manager/src/main/index.ts#L7)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [InitOptions](../#initoptions) |

**Returns:** `Promise`<[DebugManager](debugmanager.md)>

___

