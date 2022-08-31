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

### Variables

* [defaultPropNames](README.md#const-defaultpropnames)
* [performance](README.md#performance)

### Functions

* [deriveLogGroup](README.md#const-deriveloggroup)
* [deriveLogOrder](README.md#const-derivelogorder)
* [init](README.md#init)

## Type aliases

###  ConstructorOptions

Ƭ **ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [packages/debug-manager/src/defs/index.ts:29](https://github.com/badbatch/graphql-box/blob/e94b582f/packages/debug-manager/src/defs/index.ts#L29)*

___

###  DebugManagerInit

Ƭ **DebugManagerInit**: *function*

*Defined in [packages/debug-manager/src/defs/index.ts:31](https://github.com/badbatch/graphql-box/blob/e94b582f/packages/debug-manager/src/defs/index.ts#L31)*

#### Type declaration:

▸ (): *DebugManagerDef*

___

###  Environment

Ƭ **Environment**: *"client" | "server" | "worker" | "workerClient"*

*Defined in [packages/debug-manager/src/defs/index.ts:33](https://github.com/badbatch/graphql-box/blob/e94b582f/packages/debug-manager/src/defs/index.ts#L33)*

___

###  Log

Ƭ **Log**: *function*

*Defined in [packages/debug-manager/src/defs/index.ts:3](https://github.com/badbatch/graphql-box/blob/e94b582f/packages/debug-manager/src/defs/index.ts#L3)*

#### Type declaration:

▸ (`message`: string, `data`: PlainObjectMap, `level?`: LogLevel): *void*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |
`data` | PlainObjectMap |
`level?` | LogLevel |

## Variables

### `Const` defaultPropNames

• **defaultPropNames**: *string[]* = ["labels.result", "labels.variables", "labels.value"]

*Defined in [packages/debug-manager/src/helpers/serializeLog.ts:4](https://github.com/badbatch/graphql-box/blob/e94b582f/packages/debug-manager/src/helpers/serializeLog.ts#L4)*

___

###  performance

• **performance**: *Performance*

*Defined in [packages/debug-manager/src/index.test.ts:20](https://github.com/badbatch/graphql-box/blob/e94b582f/packages/debug-manager/src/index.test.ts#L20)*

## Functions

### `Const` deriveLogGroup

▸ **deriveLogGroup**(`environment`: [Environment](README.md#environment)): *1 | 2 | 3*

*Defined in [packages/debug-manager/src/helpers/deriveLogProps.ts:56](https://github.com/badbatch/graphql-box/blob/e94b582f/packages/debug-manager/src/helpers/deriveLogProps.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`environment` | [Environment](README.md#environment) |

**Returns:** *1 | 2 | 3*

___

### `Const` deriveLogOrder

▸ **deriveLogOrder**(`event`: string | symbol): *1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0*

*Defined in [packages/debug-manager/src/helpers/deriveLogProps.ts:18](https://github.com/badbatch/graphql-box/blob/e94b582f/packages/debug-manager/src/helpers/deriveLogProps.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0*

___

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *[DebugManagerInit](README.md#debugmanagerinit)*

*Defined in [packages/debug-manager/src/main/index.ts:74](https://github.com/badbatch/graphql-box/blob/e94b582f/packages/debug-manager/src/main/index.ts#L74)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *[DebugManagerInit](README.md#debugmanagerinit)*
