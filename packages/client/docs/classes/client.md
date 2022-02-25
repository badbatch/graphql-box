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

* [request](client.md#request)
* [subscribe](client.md#subscribe)
* [init](client.md#static-init)

## Constructors

###  constructor

\+ **new Client**(`options`: [ConstructorOptions](../interfaces/constructoroptions.md)): *[Client](client.md)*

*Defined in [main/index.ts:113](https://github.com/badbatch/graphql-box/blob/35d1f39/packages/client/src/main/index.ts#L113)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[Client](client.md)*

## Accessors

###  cache

• **get cache**(): *Core*

*Defined in [main/index.ts:124](https://github.com/badbatch/graphql-box/blob/35d1f39/packages/client/src/main/index.ts#L124)*

**Returns:** *Core*

___

###  debugger

• **get debugger**(): *DebugManagerDef | null*

*Defined in [main/index.ts:128](https://github.com/badbatch/graphql-box/blob/35d1f39/packages/client/src/main/index.ts#L128)*

**Returns:** *DebugManagerDef | null*

## Methods

###  request

▸ **request**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹MaybeRequestResult | AsyncIterator‹undefined | MaybeRequestResult, any, undefined› | object›*

*Defined in [main/index.ts:132](https://github.com/badbatch/graphql-box/blob/35d1f39/packages/client/src/main/index.ts#L132)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |
`context` | MaybeRequestContext | {} |

**Returns:** *Promise‹MaybeRequestResult | AsyncIterator‹undefined | MaybeRequestResult, any, undefined› | object›*

___

###  subscribe

▸ **subscribe**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹AsyncIterator‹undefined | MaybeRequestResult, any, undefined››*

*Defined in [main/index.ts:146](https://github.com/badbatch/graphql-box/blob/35d1f39/packages/client/src/main/index.ts#L146)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |
`context` | MaybeRequestContext | {} |

**Returns:** *Promise‹AsyncIterator‹undefined | MaybeRequestResult, any, undefined››*

___

### `Static` init

▸ **init**(`options`: [UserOptions](../interfaces/useroptions.md)): *Promise‹[Client](client.md)›*

*Defined in [main/index.ts:32](https://github.com/badbatch/graphql-box/blob/35d1f39/packages/client/src/main/index.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *Promise‹[Client](client.md)›*
