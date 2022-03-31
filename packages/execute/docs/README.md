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

### Variables

* [EXECUTE_EXECUTED](README.md#const-execute_executed)

### Functions

* [init](README.md#init)
* [logExecute](README.md#logexecute)

## Type aliases

###  ConstructorOptions

Ƭ **ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:37](https://github.com/badbatch/graphql-box/blob/16e3635/packages/execute/src/defs/index.ts#L37)*

___

###  GraphQLExecute

Ƭ **GraphQLExecute**: *function*

*Defined in [defs/index.ts:39](https://github.com/badbatch/graphql-box/blob/16e3635/packages/execute/src/defs/index.ts#L39)*

#### Type declaration:

▸ (`args`: ExecutionArgs): *PromiseOrValue‹ExecutionResult | AsyncGenerator‹AsyncExecutionResult, void, void››*

**Parameters:**

Name | Type |
------ | ------ |
`args` | ExecutionArgs |

## Variables

### `Const` EXECUTE_EXECUTED

• **EXECUTE_EXECUTED**: *"execute_executed"* = "execute_executed"

*Defined in [consts/index.ts:1](https://github.com/badbatch/graphql-box/blob/16e3635/packages/execute/src/consts/index.ts#L1)*

## Functions

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *RequestManagerInit*

*Defined in [main/index.ts:96](https://github.com/badbatch/graphql-box/blob/16e3635/packages/execute/src/main/index.ts#L96)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *RequestManagerInit*

___

###  logExecute

▸ **logExecute**(): *(Anonymous function)*

*Defined in [debug/log-execute/index.ts:4](https://github.com/badbatch/graphql-box/blob/16e3635/packages/execute/src/debug/log-execute/index.ts#L4)*

**Returns:** *(Anonymous function)*
