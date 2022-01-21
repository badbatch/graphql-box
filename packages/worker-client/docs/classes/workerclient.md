[Documentation](../README.md) › [WorkerClient](workerclient.md)

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

*Defined in [main/index.ts:66](https://github.com/badbatch/graphql-box/blob/cf51f3c/packages/worker-client/src/main/index.ts#L66)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`cache` | CoreWorker‹› |
`debugManager` | undefined &#124; DebugManagerDef‹› |
`worker` | Worker |

**Returns:** *[WorkerClient](workerclient.md)*

## Accessors

###  cache

• **get cache**(): *WorkerCachemap*

*Defined in [main/index.ts:76](https://github.com/badbatch/graphql-box/blob/cf51f3c/packages/worker-client/src/main/index.ts#L76)*

**Returns:** *WorkerCachemap*

## Methods

###  request

▸ **request**(`request`: string, `options`: RequestOptions): *Promise‹MaybeRequestResult›*

*Defined in [main/index.ts:80](https://github.com/badbatch/graphql-box/blob/cf51f3c/packages/worker-client/src/main/index.ts#L80)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |

**Returns:** *Promise‹MaybeRequestResult›*

___

###  subscribe

▸ **subscribe**(`request`: string, `options`: RequestOptions): *Promise‹AsyncIterator‹MaybeRequestResult | undefined››*

*Defined in [main/index.ts:88](https://github.com/badbatch/graphql-box/blob/cf51f3c/packages/worker-client/src/main/index.ts#L88)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |

**Returns:** *Promise‹AsyncIterator‹MaybeRequestResult | undefined››*

___

### `Static` init

▸ **init**(`options`: [UserOptions](../interfaces/useroptions.md)): *Promise‹[WorkerClient](workerclient.md)›*

*Defined in [main/index.ts:27](https://github.com/badbatch/graphql-box/blob/cf51f3c/packages/worker-client/src/main/index.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *Promise‹[WorkerClient](workerclient.md)›*
