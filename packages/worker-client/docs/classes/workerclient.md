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

*Defined in [main/index.ts:67](https://github.com/badbatch/graphql-box/blob/d6cf575/packages/worker-client/src/main/index.ts#L67)*

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

*Defined in [main/index.ts:77](https://github.com/badbatch/graphql-box/blob/d6cf575/packages/worker-client/src/main/index.ts#L77)*

**Returns:** *WorkerCachemap*

## Methods

###  request

▸ **request**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹MaybeRequestResult | AsyncIterableIterator‹undefined | MaybeRequestResult› | object›*

*Defined in [main/index.ts:81](https://github.com/badbatch/graphql-box/blob/d6cf575/packages/worker-client/src/main/index.ts#L81)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |
`context` | MaybeRequestContext | {} |

**Returns:** *Promise‹MaybeRequestResult | AsyncIterableIterator‹undefined | MaybeRequestResult› | object›*

___

###  subscribe

▸ **subscribe**(`request`: string, `options`: RequestOptions): *Promise‹AsyncIterator‹MaybeRequestResult | undefined››*

*Defined in [main/index.ts:89](https://github.com/badbatch/graphql-box/blob/d6cf575/packages/worker-client/src/main/index.ts#L89)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |

**Returns:** *Promise‹AsyncIterator‹MaybeRequestResult | undefined››*

___

### `Static` init

▸ **init**(`options`: [UserOptions](../interfaces/useroptions.md)): *Promise‹[WorkerClient](workerclient.md)›*

*Defined in [main/index.ts:28](https://github.com/badbatch/graphql-box/blob/d6cf575/packages/worker-client/src/main/index.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *Promise‹[WorkerClient](workerclient.md)›*
