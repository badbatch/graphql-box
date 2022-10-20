[Documentation](README.md)

# Documentation

## Index

### Classes

* [DebugManager](classes/debugmanager.md)

### Interfaces

* [Performance](interfaces/performance.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [ConstructorOptions](README.md#constructoroptions)
* [DebugManagerInit](README.md#debugmanagerinit)
* [Environment](README.md#environment)
* [Log](README.md#log)
* [TransformedOptions](README.md#transformedoptions)

### Variables

* [performance](README.md#performance)

### Functions

* [deriveLogGroup](README.md#const-deriveloggroup)
* [deriveLogOrder](README.md#const-derivelogorder)
* [init](README.md#init)
* [isServerRequestOptions](README.md#const-isserverrequestoptions)

## Type aliases

###  ConstructorOptions

Ƭ **ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [packages/debug-manager/src/defs/index.ts:29](https://github.com/badbatch/graphql-box/blob/204add77/packages/debug-manager/src/defs/index.ts#L29)*

___

###  DebugManagerInit

Ƭ **DebugManagerInit**: *function*

*Defined in [packages/debug-manager/src/defs/index.ts:31](https://github.com/badbatch/graphql-box/blob/204add77/packages/debug-manager/src/defs/index.ts#L31)*

#### Type declaration:

▸ (): *DebugManagerDef*

___

###  Environment

Ƭ **Environment**: *"client" | "server" | "worker" | "workerClient"*

*Defined in [packages/debug-manager/src/defs/index.ts:33](https://github.com/badbatch/graphql-box/blob/204add77/packages/debug-manager/src/defs/index.ts#L33)*

___

###  Log

Ƭ **Log**: *function*

*Defined in [packages/debug-manager/src/defs/index.ts:3](https://github.com/badbatch/graphql-box/blob/204add77/packages/debug-manager/src/defs/index.ts#L3)*

#### Type declaration:

▸ (`message`: string, `data`: PlainObjectMap, `level?`: LogLevel): *void*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |
`data` | PlainObjectMap |
`level?` | LogLevel |

___

###  TransformedOptions

Ƭ **TransformedOptions**: *object*

*Defined in [packages/debug-manager/src/helpers/transformOptions.ts:6](https://github.com/badbatch/graphql-box/blob/204add77/packages/debug-manager/src/helpers/transformOptions.ts#L6)*

#### Type declaration:

* **awaitDataCaching**? : *undefined | false | true*

* **batch**? : *undefined | false | true*

* **contextValue**? : *PlainObjectMap*

* **returnCacheMetadata**? : *undefined | false | true*

* **tag**? : *any*

* **variables**? : *PlainObjectMap*

## Variables

###  performance

• **performance**: *Performance*

*Defined in [packages/debug-manager/src/index.test.ts:20](https://github.com/badbatch/graphql-box/blob/204add77/packages/debug-manager/src/index.test.ts#L20)*

## Functions

### `Const` deriveLogGroup

▸ **deriveLogGroup**(`environment`: [Environment](README.md#environment), `message`: string): *1 | 2 | 3 | 4 | 5 | 0*

*Defined in [packages/debug-manager/src/helpers/deriveLogProps.ts:64](https://github.com/badbatch/graphql-box/blob/204add77/packages/debug-manager/src/helpers/deriveLogProps.ts#L64)*

**Parameters:**

Name | Type |
------ | ------ |
`environment` | [Environment](README.md#environment) |
`message` | string |

**Returns:** *1 | 2 | 3 | 4 | 5 | 0*

___

### `Const` deriveLogOrder

▸ **deriveLogOrder**(`message`: string): *1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 0*

*Defined in [packages/debug-manager/src/helpers/deriveLogProps.ts:20](https://github.com/badbatch/graphql-box/blob/204add77/packages/debug-manager/src/helpers/deriveLogProps.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

**Returns:** *1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 0*

___

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *[DebugManagerInit](README.md#debugmanagerinit)*

*Defined in [packages/debug-manager/src/main/index.ts:82](https://github.com/badbatch/graphql-box/blob/204add77/packages/debug-manager/src/main/index.ts#L82)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *[DebugManagerInit](README.md#debugmanagerinit)*

___

### `Const` isServerRequestOptions

▸ **isServerRequestOptions**(`options`: RequestOptions | ServerRequestOptions): *options is ServerRequestOptions*

*Defined in [packages/debug-manager/src/helpers/transformOptions.ts:3](https://github.com/badbatch/graphql-box/blob/204add77/packages/debug-manager/src/helpers/transformOptions.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | RequestOptions &#124; ServerRequestOptions |

**Returns:** *options is ServerRequestOptions*
