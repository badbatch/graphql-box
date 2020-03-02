[Documentation](../README.md) › [DebugManager](debugmanager.md)

# Class: DebugManager <**EventTypes**>

## Type parameters

▪ **EventTypes**: *string | symbol | object*

## Hierarchy

* EventEmitter

  ↳ **DebugManager**

## Implements

* DebugManagerDef

## Index

### Interfaces

* [EventEmitterStatic](../interfaces/debugmanager.eventemitterstatic.md)
* [ListenerFn](../interfaces/debugmanager.listenerfn.md)

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
* [init](debugmanager.md#static-init)

## Constructors

###  constructor

\+ **new DebugManager**(`__namedParameters`: object): *[DebugManager](debugmanager.md)*

*Defined in [packages/debug-manager/src/main/index.ts:21](https://github.com/badbatch/graphql-box/blob/d785ce9/packages/debug-manager/src/main/index.ts#L21)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`logger` | undefined &#124; [Logger](../interfaces/logger.md) |
`name` | string |
`performance` | [Performance](../interfaces/performance.md) |

**Returns:** *[DebugManager](debugmanager.md)*

## Properties

### `Static` EventEmitter

▪ **EventEmitter**: *[EventEmitterStatic](../interfaces/debugmanager.eventemitterstatic.md)*

Defined in node_modules/eventemitter3/index.d.ts:64

___

### `Static` prefixed

▪ **prefixed**: *string | boolean*

*Inherited from [DebugManager](debugmanager.md).[prefixed](debugmanager.md#static-prefixed)*

Defined in node_modules/eventemitter3/index.d.ts:9

## Methods

###  addListener

▸ **addListener**<**T**>(`event`: T, `fn`: [ListenerFn](../interfaces/debugmanager.listenerfn.md)‹EventArgs‹EventTypes, T››, `context?`: any): *this*

*Inherited from [DebugManager](debugmanager.md).[addListener](debugmanager.md#addlistener)*

Defined in node_modules/eventemitter3/index.d.ts:36

**Type parameters:**

▪ **T**: *EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |
`fn` | [ListenerFn](../interfaces/debugmanager.listenerfn.md)‹EventArgs‹EventTypes, T›› |
`context?` | any |

**Returns:** *this*

___

###  emit

▸ **emit**(`event`: string | symbol, `data`: PlainObjectMap): *boolean*

*Overrides void*

*Defined in [packages/debug-manager/src/main/index.ts:30](https://github.com/badbatch/graphql-box/blob/d785ce9/packages/debug-manager/src/main/index.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |
`data` | PlainObjectMap |

**Returns:** *boolean*

___

###  eventNames

▸ **eventNames**(): *Array‹EventNames‹EventTypes››*

*Inherited from [DebugManager](debugmanager.md).[eventNames](debugmanager.md#eventnames)*

Defined in node_modules/eventemitter3/index.d.ts:15

Return an array listing the events for which the emitter has registered
listeners.

**Returns:** *Array‹EventNames‹EventTypes››*

___

###  listenerCount

▸ **listenerCount**(`event`: EventNames‹EventTypes›): *number*

*Inherited from [DebugManager](debugmanager.md).[listenerCount](debugmanager.md#listenercount)*

Defined in node_modules/eventemitter3/index.d.ts:25

Return the number of listeners listening to a given event.

**Parameters:**

Name | Type |
------ | ------ |
`event` | EventNames‹EventTypes› |

**Returns:** *number*

___

###  listeners

▸ **listeners**<**T**>(`event`: T): *Array‹[ListenerFn](../interfaces/debugmanager.listenerfn.md)‹EventArgs‹EventTypes, T›››*

*Inherited from [DebugManager](debugmanager.md).[listeners](debugmanager.md#listeners)*

Defined in node_modules/eventemitter3/index.d.ts:20

Return the listeners registered for a given event.

**Type parameters:**

▪ **T**: *EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |

**Returns:** *Array‹[ListenerFn](../interfaces/debugmanager.listenerfn.md)‹EventArgs‹EventTypes, T›››*

___

###  now

▸ **now**(): *number*

*Defined in [packages/debug-manager/src/main/index.ts:37](https://github.com/badbatch/graphql-box/blob/d785ce9/packages/debug-manager/src/main/index.ts#L37)*

**Returns:** *number*

___

###  off

▸ **off**<**T**>(`event`: T, `fn?`: EventEmitter.ListenerFn‹EventArgs‹EventTypes, T››, `context?`: any, `once?`: undefined | false | true): *this*

*Inherited from [DebugManager](debugmanager.md).[off](debugmanager.md#off)*

Defined in node_modules/eventemitter3/index.d.ts:47

**Type parameters:**

▪ **T**: *EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |
`fn?` | EventEmitter.ListenerFn‹EventArgs‹EventTypes, T›› |
`context?` | any |
`once?` | undefined &#124; false &#124; true |

**Returns:** *this*

___

###  on

▸ **on**<**T**>(`event`: T, `fn`: [ListenerFn](../interfaces/debugmanager.listenerfn.md)‹EventArgs‹EventTypes, T››, `context?`: any): *this*

*Inherited from [DebugManager](debugmanager.md).[on](debugmanager.md#on)*

Defined in node_modules/eventemitter3/index.d.ts:35

Add a listener for a given event.

**Type parameters:**

▪ **T**: *EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |
`fn` | [ListenerFn](../interfaces/debugmanager.listenerfn.md)‹EventArgs‹EventTypes, T›› |
`context?` | any |

**Returns:** *this*

___

###  once

▸ **once**<**T**>(`event`: T, `fn`: [ListenerFn](../interfaces/debugmanager.listenerfn.md)‹EventArgs‹EventTypes, T››, `context?`: any): *this*

*Inherited from [DebugManager](debugmanager.md).[once](debugmanager.md#once)*

Defined in node_modules/eventemitter3/index.d.ts:41

Add a one-time listener for a given event.

**Type parameters:**

▪ **T**: *EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |
`fn` | [ListenerFn](../interfaces/debugmanager.listenerfn.md)‹EventArgs‹EventTypes, T›› |
`context?` | any |

**Returns:** *this*

___

###  removeAllListeners

▸ **removeAllListeners**(`event?`: EventNames‹EventTypes›): *this*

*Inherited from [DebugManager](debugmanager.md).[removeAllListeners](debugmanager.md#removealllisteners)*

Defined in node_modules/eventemitter3/index.d.ts:52

Remove all listeners, or those of the specified event.

**Parameters:**

Name | Type |
------ | ------ |
`event?` | EventNames‹EventTypes› |

**Returns:** *this*

___

###  removeListener

▸ **removeListener**<**T**>(`event`: T, `fn?`: EventEmitter.ListenerFn‹EventArgs‹EventTypes, T››, `context?`: any, `once?`: undefined | false | true): *this*

*Inherited from [DebugManager](debugmanager.md).[removeListener](debugmanager.md#removelistener)*

Defined in node_modules/eventemitter3/index.d.ts:46

Remove the listeners of a given event.

**Type parameters:**

▪ **T**: *EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |
`fn?` | EventEmitter.ListenerFn‹EventArgs‹EventTypes, T›› |
`context?` | any |
`once?` | undefined &#124; false &#124; true |

**Returns:** *this*

___

### `Static` init

▸ **init**(`options`: [InitOptions](../README.md#initoptions)): *Promise‹[DebugManager](debugmanager.md)›*

*Defined in [packages/debug-manager/src/main/index.ts:7](https://github.com/badbatch/graphql-box/blob/d785ce9/packages/debug-manager/src/main/index.ts#L7)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../README.md#initoptions) |

**Returns:** *Promise‹[DebugManager](debugmanager.md)›*
