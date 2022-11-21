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

*Defined in [main/index.ts:34](https://github.com/badbatch/graphql-box/blob/e966cb9b/packages/worker-client/src/main/index.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *[WorkerClient](workerclient.md)*

## Accessors

###  cache

• **get cache**(): *WorkerCachemap*

*Defined in [main/index.ts:63](https://github.com/badbatch/graphql-box/blob/e966cb9b/packages/worker-client/src/main/index.ts#L63)*

**Returns:** *WorkerCachemap*

## Methods

###  mutate

▸ **mutate**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹MaybeRequestResult | AsyncIterableIterator‹undefined | MaybeRequestResult› | object›*

*Defined in [main/index.ts:67](https://github.com/badbatch/graphql-box/blob/e966cb9b/packages/worker-client/src/main/index.ts#L67)*

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

*Defined in [main/index.ts:71](https://github.com/badbatch/graphql-box/blob/e966cb9b/packages/worker-client/src/main/index.ts#L71)*

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

*Defined in [main/index.ts:75](https://github.com/badbatch/graphql-box/blob/e966cb9b/packages/worker-client/src/main/index.ts#L75)*

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

*Defined in [main/index.ts:79](https://github.com/badbatch/graphql-box/blob/e966cb9b/packages/worker-client/src/main/index.ts#L79)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |

**Returns:** *Promise‹AsyncIterableIterator‹undefined | MaybeRequestResult› | object›*
