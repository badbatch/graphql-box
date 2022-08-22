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

*Defined in [main/index.ts:76](https://github.com/badbatch/graphql-box/blob/7a747f5/packages/client/src/main/index.ts#L76)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *[Client](client.md)*

## Accessors

###  cache

• **get cache**(): *Core*

*Defined in [main/index.ts:109](https://github.com/badbatch/graphql-box/blob/7a747f5/packages/client/src/main/index.ts#L109)*

**Returns:** *Core*

___

###  debugger

• **get debugger**(): *DebugManagerDef | null*

*Defined in [main/index.ts:113](https://github.com/badbatch/graphql-box/blob/7a747f5/packages/client/src/main/index.ts#L113)*

**Returns:** *DebugManagerDef | null*

## Methods

###  mutate

▸ **mutate**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹MaybeRequestResult | AsyncIterator‹undefined | MaybeRequestResult, any, undefined››*

*Defined in [main/index.ts:117](https://github.com/badbatch/graphql-box/blob/7a747f5/packages/client/src/main/index.ts#L117)*

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

*Defined in [main/index.ts:128](https://github.com/badbatch/graphql-box/blob/7a747f5/packages/client/src/main/index.ts#L128)*

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

*Defined in [main/index.ts:139](https://github.com/badbatch/graphql-box/blob/7a747f5/packages/client/src/main/index.ts#L139)*

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

*Defined in [main/index.ts:150](https://github.com/badbatch/graphql-box/blob/7a747f5/packages/client/src/main/index.ts#L150)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |
`context` | MaybeRequestContext | {} |

**Returns:** *Promise‹MaybeRequestResult | AsyncIterator‹undefined | MaybeRequestResult, any, undefined››*
