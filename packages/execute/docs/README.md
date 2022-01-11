[Documentation](README.md)

# Documentation

## Index

### Classes

* [Execute](classes/execute.md)

### Interfaces

* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [ConstructorOptions](README.md#constructoroptions)
* [GraphQLExecute](README.md#graphqlexecute)
* [InitOptions](README.md#initoptions)

### Variables

* [EXECUTE_EXECUTED](README.md#const-execute_executed)

### Functions

* [init](README.md#init)
* [logExecute](README.md#logexecute)

## Type aliases

###  ConstructorOptions

Ƭ **ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:40](https://github.com/badbatch/graphql-box/blob/7c5a3cd/packages/execute/src/defs/index.ts#L40)*

___

###  GraphQLExecute

Ƭ **GraphQLExecute**: *function*

*Defined in [defs/index.ts:42](https://github.com/badbatch/graphql-box/blob/7c5a3cd/packages/execute/src/defs/index.ts#L42)*

#### Type declaration:

▸ ‹**TData**›(`args`: ExecutionArgs): *PromiseOrValue‹ExecutionResult‹TData››*

**Type parameters:**

▪ **TData**

**Parameters:**

Name | Type |
------ | ------ |
`args` | ExecutionArgs |

___

###  InitOptions

Ƭ **InitOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:38](https://github.com/badbatch/graphql-box/blob/7c5a3cd/packages/execute/src/defs/index.ts#L38)*

## Variables

### `Const` EXECUTE_EXECUTED

• **EXECUTE_EXECUTED**: *"execute_executed"* = "execute_executed"

*Defined in [consts/index.ts:1](https://github.com/badbatch/graphql-box/blob/7c5a3cd/packages/execute/src/consts/index.ts#L1)*

## Functions

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *RequestManagerInit*

*Defined in [main/index.ts:68](https://github.com/badbatch/graphql-box/blob/7c5a3cd/packages/execute/src/main/index.ts#L68)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *RequestManagerInit*

___

###  logExecute

▸ **logExecute**(): *(Anonymous function)*

*Defined in [debug/log-execute/index.ts:4](https://github.com/badbatch/graphql-box/blob/7c5a3cd/packages/execute/src/debug/log-execute/index.ts#L4)*

**Returns:** *(Anonymous function)*
