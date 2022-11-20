[Documentation](../README.md) › [Client](client.md)

# Class: Client

## Hierarchy

* **Client**

## Index

### Constructors

* [constructor](client.md#constructor)

### Accessors

* [cache](client.md#cache)
* [debugger](client.md#debugger)

### Methods

* [mutate](client.md#mutate)
* [query](client.md#query)
* [request](client.md#request)
* [subscribe](client.md#subscribe)

## Constructors

###  constructor

\+ **new Client**(`options`: [UserOptions](../interfaces/useroptions.md)): *[Client](client.md)*

*Defined in [main/index.ts:78](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/client/src/main/index.ts#L78)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *[Client](client.md)*

## Accessors

###  cache

• **get cache**(): *Core*

*Defined in [main/index.ts:110](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/client/src/main/index.ts#L110)*

**Returns:** *Core*

___

###  debugger

• **get debugger**(): *DebugManagerDef | null*

*Defined in [main/index.ts:114](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/client/src/main/index.ts#L114)*

**Returns:** *DebugManagerDef | null*

## Methods

###  mutate

▸ **mutate**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹MaybeRequestResult | AsyncIterator‹undefined | MaybeRequestResult, any, undefined››*

*Defined in [main/index.ts:118](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/client/src/main/index.ts#L118)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |
`context` | MaybeRequestContext | {} |

**Returns:** *Promise‹MaybeRequestResult | AsyncIterator‹undefined | MaybeRequestResult, any, undefined››*

___

###  query

▸ **query**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹MaybeRequestResult | AsyncIterator‹undefined | MaybeRequestResult, any, undefined››*

*Defined in [main/index.ts:129](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/client/src/main/index.ts#L129)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |
`context` | MaybeRequestContext | {} |

**Returns:** *Promise‹MaybeRequestResult | AsyncIterator‹undefined | MaybeRequestResult, any, undefined››*

___

###  request

▸ **request**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹MaybeRequestResult | AsyncIterator‹undefined | MaybeRequestResult, any, undefined››*

*Defined in [main/index.ts:140](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/client/src/main/index.ts#L140)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |
`context` | MaybeRequestContext | {} |

**Returns:** *Promise‹MaybeRequestResult | AsyncIterator‹undefined | MaybeRequestResult, any, undefined››*

___

###  subscribe

▸ **subscribe**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹MaybeRequestResult | AsyncIterator‹undefined | MaybeRequestResult, any, undefined››*

*Defined in [main/index.ts:151](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/client/src/main/index.ts#L151)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |
`context` | MaybeRequestContext | {} |

**Returns:** *Promise‹MaybeRequestResult | AsyncIterator‹undefined | MaybeRequestResult, any, undefined››*
