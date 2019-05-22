[Documentation](../README.md) > [Client](../classes/client.md)

# Class: Client

## Hierarchy

**Client**

## Index

### Constructors

* [constructor](client.md#constructor)

### Accessors

* [cache](client.md#cache)

### Methods

* [request](client.md#request)
* [subscribe](client.md#subscribe)
* [init](client.md#init)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Client**(options: *[ConstructorOptions](../interfaces/constructoroptions.md)*): [Client](client.md)

*Defined in [main/index.ts:115](https://github.com/bad-batch/handl/blob/20503ed/packages/client/src/main/index.ts#L115)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** [Client](client.md)

___

## Accessors

<a id="cache"></a>

###  cache

**get cache**(): `Core` \| `null`

*Defined in [main/index.ts:126](https://github.com/bad-batch/handl/blob/20503ed/packages/client/src/main/index.ts#L126)*

**Returns:** `Core` \| `null`

___

## Methods

<a id="request"></a>

###  request

▸ **request**(request: *`string`*, options?: *`RequestOptions`*, context?: *`MaybeRequestContext`*): `Promise`<`MaybeRequestResult`>

*Defined in [main/index.ts:131](https://github.com/bad-batch/handl/blob/20503ed/packages/client/src/main/index.ts#L131)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| request | `string` | - |
| `Default value` options | `RequestOptions` |  {} |
| `Default value` context | `MaybeRequestContext` |  {} |

**Returns:** `Promise`<`MaybeRequestResult`>

___
<a id="subscribe"></a>

###  subscribe

▸ **subscribe**(request: *`string`*, options?: *`RequestOptions`*, context?: *`MaybeRequestContext`*): `Promise`<`AsyncIterator`<`MaybeRequestResult` \| `undefined`>>

*Defined in [main/index.ts:146](https://github.com/bad-batch/handl/blob/20503ed/packages/client/src/main/index.ts#L146)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| request | `string` | - |
| `Default value` options | `RequestOptions` |  {} |
| `Default value` context | `MaybeRequestContext` |  {} |

**Returns:** `Promise`<`AsyncIterator`<`MaybeRequestResult` \| `undefined`>>

___
<a id="init"></a>

### `<Static>` init

▸ **init**(options: *[UserOptions](../interfaces/useroptions.md)*): `Promise`<[Client](client.md)>

*Defined in [main/index.ts:32](https://github.com/bad-batch/handl/blob/20503ed/packages/client/src/main/index.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UserOptions](../interfaces/useroptions.md) |

**Returns:** `Promise`<[Client](client.md)>

___

