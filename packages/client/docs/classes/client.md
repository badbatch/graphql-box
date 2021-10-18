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

*Defined in [main/index.ts:108](https://github.com/badbatch/graphql-box/blob/9c9f902/packages/client/src/main/index.ts#L108)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[Client](client.md)*

## Accessors

###  cache

• **get cache**(): *Core*

*Defined in [main/index.ts:119](https://github.com/badbatch/graphql-box/blob/9c9f902/packages/client/src/main/index.ts#L119)*

**Returns:** *Core*

___

###  debugger

• **get debugger**(): *DebugManagerDef | null*

*Defined in [main/index.ts:123](https://github.com/badbatch/graphql-box/blob/9c9f902/packages/client/src/main/index.ts#L123)*

**Returns:** *DebugManagerDef | null*

## Methods

###  request

▸ **request**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹MaybeRequestResult›*

*Defined in [main/index.ts:127](https://github.com/badbatch/graphql-box/blob/9c9f902/packages/client/src/main/index.ts#L127)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |
`context` | MaybeRequestContext | {} |

**Returns:** *Promise‹MaybeRequestResult›*

___

###  subscribe

▸ **subscribe**(`request`: string, `options`: RequestOptions, `context`: MaybeRequestContext): *Promise‹AsyncIterator‹MaybeRequestResult | undefined››*

*Defined in [main/index.ts:142](https://github.com/badbatch/graphql-box/blob/9c9f902/packages/client/src/main/index.ts#L142)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`request` | string | - |
`options` | RequestOptions | {} |
`context` | MaybeRequestContext | {} |

**Returns:** *Promise‹AsyncIterator‹MaybeRequestResult | undefined››*

___

### `Static` init

▸ **init**(`options`: [UserOptions](../interfaces/useroptions.md)): *Promise‹[Client](client.md)›*

*Defined in [main/index.ts:31](https://github.com/badbatch/graphql-box/blob/9c9f902/packages/client/src/main/index.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *Promise‹[Client](client.md)›*
