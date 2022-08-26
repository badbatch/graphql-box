[Documentation](README.md)

# Documentation

## Index

### Classes

* [DebugManager](classes/debugmanager.md)

### Interfaces

* [Logger](interfaces/logger.md)
* [Performance](interfaces/performance.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [ConstructorOptions](README.md#constructoroptions)
* [DebugManagerInit](README.md#debugmanagerinit)
* [DebugManagerLocation](README.md#debugmanagerlocation)
* [LogLevel](README.md#loglevel)

### Variables

* [performance](README.md#performance)

### Functions

* [init](README.md#init)

## Type aliases

###  ConstructorOptions

Ƭ **ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [packages/debug-manager/src/defs/index.ts:31](https://github.com/badbatch/graphql-box/blob/35dc44a/packages/debug-manager/src/defs/index.ts#L31)*

___

###  DebugManagerInit

Ƭ **DebugManagerInit**: *function*

*Defined in [packages/debug-manager/src/defs/index.ts:33](https://github.com/badbatch/graphql-box/blob/35dc44a/packages/debug-manager/src/defs/index.ts#L33)*

#### Type declaration:

▸ (): *DebugManagerDef*

___

###  DebugManagerLocation

Ƭ **DebugManagerLocation**: *"client" | "server" | "worker" | "workerClient"*

*Defined in [packages/debug-manager/src/defs/index.ts:35](https://github.com/badbatch/graphql-box/blob/35dc44a/packages/debug-manager/src/defs/index.ts#L35)*

___

###  LogLevel

Ƭ **LogLevel**: *"error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly"*

*Defined in [packages/debug-manager/src/defs/index.ts:37](https://github.com/badbatch/graphql-box/blob/35dc44a/packages/debug-manager/src/defs/index.ts#L37)*

## Variables

###  performance

• **performance**: *Performance*

*Defined in [packages/debug-manager/src/index.test.ts:20](https://github.com/badbatch/graphql-box/blob/35dc44a/packages/debug-manager/src/index.test.ts#L20)*

## Functions

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *[DebugManagerInit](README.md#debugmanagerinit)*

*Defined in [packages/debug-manager/src/main/index.ts:77](https://github.com/badbatch/graphql-box/blob/35dc44a/packages/debug-manager/src/main/index.ts#L77)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *[DebugManagerInit](README.md#debugmanagerinit)*
