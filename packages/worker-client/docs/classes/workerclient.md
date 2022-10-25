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

* [mutate](workerclient.md#mutate)
* [query](workerclient.md#query)
* [request](workerclient.md#request)
* [subscribe](workerclient.md#subscribe)

## Constructors

###  constructor

\+ **new WorkerClient**(`options`: [UserOptions](../interfaces/useroptions.md)): *[WorkerClient](workerclient.md)*

*Defined in [main/index.ts:33](https://github.com/badbatch/graphql-box/blob/c1bd2514/packages/worker-client/src/main/index.ts#L33)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *[WorkerClient](workerclient.md)*

## Accessors

###  cache

• **get cache**(): *WorkerCachemap*

*Defined in [main/index.ts:61](https://github.com/badbatch/graphql-box/blob/c1bd2514/packages/worker-client/src/main/index.ts#L61)*

**Returns:** *WorkerCachemap*

## Methods

###  mutate

▸ **mutate**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹MaybeRequestResult | AsyncIterableIterator‹undefined | MaybeRequestResult› | object›*

*Defined in [main/index.ts:65](https://github.com/badbatch/graphql-box/blob/c1bd2514/packages/worker-client/src/main/index.ts#L65)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |
`context` | MaybeRequestContext | {} |

**Returns:** *Promise‹MaybeRequestResult | AsyncIterableIterator‹undefined | MaybeRequestResult› | object›*

___

###  query

▸ **query**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹MaybeRequestResult | AsyncIterableIterator‹undefined | MaybeRequestResult› | object›*

*Defined in [main/index.ts:69](https://github.com/badbatch/graphql-box/blob/c1bd2514/packages/worker-client/src/main/index.ts#L69)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |
`context` | MaybeRequestContext | {} |

**Returns:** *Promise‹MaybeRequestResult | AsyncIterableIterator‹undefined | MaybeRequestResult› | object›*

___

###  request

▸ **request**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹MaybeRequestResult | AsyncIterableIterator‹undefined | MaybeRequestResult› | object›*

*Defined in [main/index.ts:73](https://github.com/badbatch/graphql-box/blob/c1bd2514/packages/worker-client/src/main/index.ts#L73)*

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

*Defined in [main/index.ts:77](https://github.com/badbatch/graphql-box/blob/c1bd2514/packages/worker-client/src/main/index.ts#L77)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |

**Returns:** *Promise‹AsyncIterableIterator‹undefined | MaybeRequestResult› | object›*
