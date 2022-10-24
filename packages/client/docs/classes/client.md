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

*Defined in [main/index.ts:79](https://github.com/badbatch/graphql-box/blob/8ceb40cb/packages/client/src/main/index.ts#L79)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *[Client](client.md)*

## Accessors

###  cache

• **get cache**(): *Core*

*Defined in [main/index.ts:112](https://github.com/badbatch/graphql-box/blob/8ceb40cb/packages/client/src/main/index.ts#L112)*

**Returns:** *Core*

___

###  debugger

• **get debugger**(): *DebugManagerDef | null*

*Defined in [main/index.ts:116](https://github.com/badbatch/graphql-box/blob/8ceb40cb/packages/client/src/main/index.ts#L116)*

**Returns:** *DebugManagerDef | null*

## Methods

###  mutate

▸ **mutate**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹MaybeRequestResult | AsyncIterator‹undefined | MaybeRequestResult, any, undefined››*

*Defined in [main/index.ts:120](https://github.com/badbatch/graphql-box/blob/8ceb40cb/packages/client/src/main/index.ts#L120)*

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

*Defined in [main/index.ts:131](https://github.com/badbatch/graphql-box/blob/8ceb40cb/packages/client/src/main/index.ts#L131)*

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

*Defined in [main/index.ts:142](https://github.com/badbatch/graphql-box/blob/8ceb40cb/packages/client/src/main/index.ts#L142)*

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

*Defined in [main/index.ts:153](https://github.com/badbatch/graphql-box/blob/8ceb40cb/packages/client/src/main/index.ts#L153)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |
`context` | MaybeRequestContext | {} |

**Returns:** *Promise‹MaybeRequestResult | AsyncIterator‹undefined | MaybeRequestResult, any, undefined››*
