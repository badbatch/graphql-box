[Documentation](../README.md) > [Server](../classes/server.md)

# Class: Server

## Hierarchy

**Server**

## Index

### Constructors

* [constructor](server.md#constructor)

### Methods

* [message](server.md#message)
* [request](server.md#request)
* [init](server.md#init)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Server**(__namedParameters: *`object`*): [Server](server.md)

*Defined in [main/index.ts:41](https://github.com/bad-batch/handl/blob/20503ed/packages/server/src/main/index.ts#L41)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| client | `Client` |

**Returns:** [Server](server.md)

___

## Methods

<a id="message"></a>

###  message

▸ **message**(options: *`ServerSocketRequestOptions`*): [MessageHandler](../#messagehandler)

*Defined in [main/index.ts:53](https://github.com/bad-batch/handl/blob/20503ed/packages/server/src/main/index.ts#L53)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | `ServerSocketRequestOptions` |

**Returns:** [MessageHandler](../#messagehandler)

___
<a id="request"></a>

###  request

▸ **request**(options?: *`ServerRequestOptions`*): [RequestHandler](../#requesthandler)

*Defined in [main/index.ts:47](https://github.com/bad-batch/handl/blob/20503ed/packages/server/src/main/index.ts#L47)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` options | `ServerRequestOptions` |  {} |

**Returns:** [RequestHandler](../#requesthandler)

___
<a id="init"></a>

### `<Static>` init

▸ **init**(options: *[UserOptions](../interfaces/useroptions.md)*): `Promise`<[Server](server.md)>

*Defined in [main/index.ts:25](https://github.com/bad-batch/handl/blob/20503ed/packages/server/src/main/index.ts#L25)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UserOptions](../interfaces/useroptions.md) |

**Returns:** `Promise`<[Server](server.md)>

___

