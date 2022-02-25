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
* [InitOptions](README.md#initoptions)

### Variables

* [performance](README.md#performance)

### Functions

* [init](README.md#init)

## Type aliases

###  ConstructorOptions

Ƭ **ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [packages/debug-manager/src/defs/index.ts:28](https://github.com/badbatch/graphql-box/blob/35d1f39/packages/debug-manager/src/defs/index.ts#L28)*

___

###  DebugManagerInit

Ƭ **DebugManagerInit**: *function*

*Defined in [packages/debug-manager/src/defs/index.ts:30](https://github.com/badbatch/graphql-box/blob/35d1f39/packages/debug-manager/src/defs/index.ts#L30)*

#### Type declaration:

▸ (): *Promise‹DebugManagerDef›*

___

###  InitOptions

Ƭ **InitOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [packages/debug-manager/src/defs/index.ts:26](https://github.com/badbatch/graphql-box/blob/35d1f39/packages/debug-manager/src/defs/index.ts#L26)*

## Variables

###  performance

• **performance**: *Performance*

*Defined in [packages/debug-manager/src/index.test.ts:14](https://github.com/badbatch/graphql-box/blob/35d1f39/packages/debug-manager/src/index.test.ts#L14)*

## Functions

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *[DebugManagerInit](README.md#debugmanagerinit)*

*Defined in [packages/debug-manager/src/main/index.ts:46](https://github.com/badbatch/graphql-box/blob/35d1f39/packages/debug-manager/src/main/index.ts#L46)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *[DebugManagerInit](README.md#debugmanagerinit)*
