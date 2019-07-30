> **[Documentation](../README.md)**

[WorkerClient](workerclient.md) /

# Class: WorkerClient

## Hierarchy

* **WorkerClient**

## Index

### Constructors

* [constructor](workerclient.md#constructor)

### Accessors

* [cache](workerclient.md#cache)

### Methods

* [request](workerclient.md#request)
* [subscribe](workerclient.md#subscribe)
* [init](workerclient.md#static-init)

## Constructors

###  constructor

\+ **new WorkerClient**(`__namedParameters`: object): *[WorkerClient](workerclient.md)*

*Defined in [main/index.ts:61](https://github.com/badbatch/graphql-box/blob/22b398c/packages/worker-client/src/main/index.ts#L61)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`debugManager` | undefined \| `DebugManagerDef` |
`worker` | `Worker` |

**Returns:** *[WorkerClient](workerclient.md)*

## Accessors

###  cache

• **get cache**(): *`WorkerCachemap`*

*Defined in [main/index.ts:71](https://github.com/badbatch/graphql-box/blob/22b398c/packages/worker-client/src/main/index.ts#L71)*

**Returns:** *`WorkerCachemap`*

## Methods

###  request

▸ **request**(`request`: string, `options`: `RequestOptions`): *`Promise<MaybeRequestResult>`*

*Defined in [main/index.ts:75](https://github.com/badbatch/graphql-box/blob/22b398c/packages/worker-client/src/main/index.ts#L75)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | `RequestOptions` |  {} |

**Returns:** *`Promise<MaybeRequestResult>`*

___

###  subscribe

▸ **subscribe**(`request`: string, `options`: `RequestOptions`): *`Promise<AsyncIterator<MaybeRequestResult | undefined>>`*

*Defined in [main/index.ts:86](https://github.com/badbatch/graphql-box/blob/22b398c/packages/worker-client/src/main/index.ts#L86)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | `RequestOptions` |  {} |

**Returns:** *`Promise<AsyncIterator<MaybeRequestResult | undefined>>`*

___

### `Static` init

▸ **init**(`options`: [UserOptions](../interfaces/useroptions.md)): *`Promise<WorkerClient>`*

*Defined in [main/index.ts:27](https://github.com/badbatch/graphql-box/blob/22b398c/packages/worker-client/src/main/index.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *`Promise<WorkerClient>`*