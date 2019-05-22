
#  Documentation

## Index

### Classes

* [WebsocketManager](classes/websocketmanager.md)

### Interfaces

* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [ConstructorOptions](#constructoroptions)
* [InitOptions](#initoptions)

### Functions

* [init](#init)
* [onOpen](#onopen)

---

## Type aliases

<a id="constructoroptions"></a>

###  ConstructorOptions

**Ƭ ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:11](https://github.com/bad-batch/handl/blob/20503ed/packages/websocket-manager/src/defs/index.ts#L11)*

___
<a id="initoptions"></a>

###  InitOptions

**Ƭ InitOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:9](https://github.com/bad-batch/handl/blob/20503ed/packages/websocket-manager/src/defs/index.ts#L9)*

___

## Functions

<a id="init"></a>

###  init

▸ **init**(userOptions: *[UserOptions](interfaces/useroptions.md)*): `SubscriptionsManagerInit`

*Defined in [main/index.ts:89](https://github.com/bad-batch/handl/blob/20503ed/packages/websocket-manager/src/main/index.ts#L89)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| userOptions | [UserOptions](interfaces/useroptions.md) |

**Returns:** `SubscriptionsManagerInit`

___
<a id="onopen"></a>

###  onOpen

▸ **onOpen**(websocket: *`WebSocket`*): `Promise`<`void`>

*Defined in [index.test.ts:12](https://github.com/bad-batch/handl/blob/20503ed/packages/websocket-manager/src/index.test.ts#L12)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| websocket | `WebSocket` |

**Returns:** `Promise`<`void`>

___

