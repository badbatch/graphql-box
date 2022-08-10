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

*Defined in [main/index.ts:30](https://github.com/badbatch/graphql-box/blob/bd9b7ae/packages/worker-client/src/main/index.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *[WorkerClient](workerclient.md)*

## Accessors

###  cache

• **get cache**(): *WorkerCachemap*

*Defined in [main/index.ts:58](https://github.com/badbatch/graphql-box/blob/bd9b7ae/packages/worker-client/src/main/index.ts#L58)*

**Returns:** *WorkerCachemap*

## Methods

###  mutate

▸ **mutate**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹MaybeRequestResult | AsyncIterableIterator‹undefined | MaybeRequestResult› | object›*

*Defined in [main/index.ts:62](https://github.com/badbatch/graphql-box/blob/bd9b7ae/packages/worker-client/src/main/index.ts#L62)*

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

*Defined in [main/index.ts:66](https://github.com/badbatch/graphql-box/blob/bd9b7ae/packages/worker-client/src/main/index.ts#L66)*

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

*Defined in [main/index.ts:70](https://github.com/badbatch/graphql-box/blob/bd9b7ae/packages/worker-client/src/main/index.ts#L70)*

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

*Defined in [main/index.ts:74](https://github.com/badbatch/graphql-box/blob/bd9b7ae/packages/worker-client/src/main/index.ts#L74)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |

**Returns:** *Promise‹AsyncIterableIterator‹undefined | MaybeRequestResult› | object›*
