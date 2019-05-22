[Documentation](../README.md) > [WorkerClient](../classes/workerclient.md)

# Class: WorkerClient

## Hierarchy

**WorkerClient**

## Index

### Constructors

* [constructor](workerclient.md#constructor)

### Accessors

* [cache](workerclient.md#cache)

### Methods

* [request](workerclient.md#request)
* [subscribe](workerclient.md#subscribe)
* [init](workerclient.md#init)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new WorkerClient**(__namedParameters: *`object`*): [WorkerClient](workerclient.md)

*Defined in [main/index.ts:61](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/main/index.ts#L61)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| debugManager | `undefined` \| `DebugManagerDef` |
| worker | `Worker` |

**Returns:** [WorkerClient](workerclient.md)

___

## Accessors

<a id="cache"></a>

###  cache

**get cache**(): `WorkerCachemap`

*Defined in [main/index.ts:71](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/main/index.ts#L71)*

**Returns:** `WorkerCachemap`

___

## Methods

<a id="request"></a>

###  request

▸ **request**(request: *`string`*, options?: *`RequestOptions`*): `Promise`<`MaybeRequestResult`>

*Defined in [main/index.ts:75](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/main/index.ts#L75)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| request | `string` | - |
| `Default value` options | `RequestOptions` |  {} |

**Returns:** `Promise`<`MaybeRequestResult`>

___
<a id="subscribe"></a>

###  subscribe

▸ **subscribe**(request: *`string`*, options?: *`RequestOptions`*): `Promise`<`AsyncIterator`<`MaybeRequestResult` \| `undefined`>>

*Defined in [main/index.ts:86](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/main/index.ts#L86)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| request | `string` | - |
| `Default value` options | `RequestOptions` |  {} |

**Returns:** `Promise`<`AsyncIterator`<`MaybeRequestResult` \| `undefined`>>

___
<a id="init"></a>

### `<Static>` init

▸ **init**(options: *[UserOptions](../interfaces/useroptions.md)*): `Promise`<[WorkerClient](workerclient.md)>

*Defined in [main/index.ts:27](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/main/index.ts#L27)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UserOptions](../interfaces/useroptions.md) |

**Returns:** `Promise`<[WorkerClient](workerclient.md)>

___

