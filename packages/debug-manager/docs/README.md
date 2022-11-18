[Documentation](README.md)

# Documentation

## Index

### Classes

* [DebugManager](classes/debugmanager.md)

### Interfaces

* [Performance](interfaces/performance.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [Environment](README.md#environment)
* [Log](README.md#log)
* [TransformedOptions](README.md#transformedoptions)

### Variables

* [performance](README.md#performance)

### Functions

* [deriveLogGroup](README.md#const-deriveloggroup)
* [deriveLogOrder](README.md#const-derivelogorder)
* [isServerRequestOptions](README.md#const-isserverrequestoptions)

## Type aliases

###  Environment

Ƭ **Environment**: *"client" | "server" | "worker" | "workerClient"*

*Defined in [packages/debug-manager/src/defs/index.ts:29](https://github.com/badbatch/graphql-box/blob/d5028cd3/packages/debug-manager/src/defs/index.ts#L29)*

___

###  Log

Ƭ **Log**: *function*

*Defined in [packages/debug-manager/src/defs/index.ts:3](https://github.com/badbatch/graphql-box/blob/d5028cd3/packages/debug-manager/src/defs/index.ts#L3)*

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

*Defined in [packages/debug-manager/src/helpers/transformOptions.ts:6](https://github.com/badbatch/graphql-box/blob/d5028cd3/packages/debug-manager/src/helpers/transformOptions.ts#L6)*

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

*Defined in [packages/debug-manager/src/index.test.ts:20](https://github.com/badbatch/graphql-box/blob/d5028cd3/packages/debug-manager/src/index.test.ts#L20)*

## Functions

### `Const` deriveLogGroup

▸ **deriveLogGroup**(`environment`: [Environment](README.md#environment), `message`: string): *1 | 2 | 3 | 4 | 5 | 0*

*Defined in [packages/debug-manager/src/helpers/deriveLogProps.ts:68](https://github.com/badbatch/graphql-box/blob/d5028cd3/packages/debug-manager/src/helpers/deriveLogProps.ts#L68)*

**Parameters:**

Name | Type |
------ | ------ |
`environment` | [Environment](README.md#environment) |
`message` | string |

**Returns:** *1 | 2 | 3 | 4 | 5 | 0*

___

### `Const` deriveLogOrder

▸ **deriveLogOrder**(`message`: string): *1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 0*

*Defined in [packages/debug-manager/src/helpers/deriveLogProps.ts:21](https://github.com/badbatch/graphql-box/blob/d5028cd3/packages/debug-manager/src/helpers/deriveLogProps.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

**Returns:** *1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 0*

___

### `Const` isServerRequestOptions

▸ **isServerRequestOptions**(`options`: RequestOptions | ServerRequestOptions): *options is ServerRequestOptions*

*Defined in [packages/debug-manager/src/helpers/transformOptions.ts:3](https://github.com/badbatch/graphql-box/blob/d5028cd3/packages/debug-manager/src/helpers/transformOptions.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | RequestOptions &#124; ServerRequestOptions |

**Returns:** *options is ServerRequestOptions*
