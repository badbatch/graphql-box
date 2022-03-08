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

## Constructors

###  constructor

\+ **new WorkerClient**(`options`: [UserOptions](../interfaces/useroptions.md)): *[WorkerClient](workerclient.md)*

*Defined in [main/index.ts:29](https://github.com/badbatch/graphql-box/blob/6718c4a/packages/worker-client/src/main/index.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *[WorkerClient](workerclient.md)*

## Accessors

###  cache

• **get cache**(): *WorkerCachemap*

*Defined in [main/index.ts:57](https://github.com/badbatch/graphql-box/blob/6718c4a/packages/worker-client/src/main/index.ts#L57)*

**Returns:** *WorkerCachemap*

## Methods

###  request

▸ **request**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹MaybeRequestResult | AsyncIterableIterator‹undefined | MaybeRequestResult› | object›*

*Defined in [main/index.ts:61](https://github.com/badbatch/graphql-box/blob/6718c4a/packages/worker-client/src/main/index.ts#L61)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |
`context` | MaybeRequestContext | {} |

**Returns:** *Promise‹MaybeRequestResult | AsyncIterableIterator‹undefined | MaybeRequestResult› | object›*

___

###  subscribe

▸ **subscribe**(`request`: string, `options`: RequestOptions): *Promise‹AsyncIterableIterator‹undefined | MaybeRequestResult› | object›*

*Defined in [main/index.ts:65](https://github.com/badbatch/graphql-box/blob/6718c4a/packages/worker-client/src/main/index.ts#L65)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |

**Returns:** *Promise‹AsyncIterableIterator‹undefined | MaybeRequestResult› | object›*
