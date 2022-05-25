[Documentation](README.md)

# Documentation

## Index

### Classes

* [Subscribe](classes/subscribe.md)

### Interfaces

* [SubscribeArgs](interfaces/subscribeargs.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [ConstructorOptions](README.md#constructoroptions)
* [GraphQLSubscribe](README.md#graphqlsubscribe)

### Functions

* [init](README.md#init)

## Type aliases

###  ConstructorOptions

Ƭ **ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:42](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/subscribe/src/defs/index.ts#L42)*

___

###  GraphQLSubscribe

Ƭ **GraphQLSubscribe**: *function*

*Defined in [defs/index.ts:44](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/subscribe/src/defs/index.ts#L44)*

#### Type declaration:

▸ ‹**TData**›(`args`: object): *Promise‹AsyncIterator‹ExecutionResult‹TData›› | ExecutionResult‹TData››*

**Type parameters:**

▪ **TData**

**Parameters:**

▪ **args**: *object*

Name | Type |
------ | ------ |
`contextValue?` | any |
`document` | DocumentNode |
`fieldResolver?` | Maybe‹GraphQLFieldResolver‹any, any›› |
`operationName?` | Maybe‹string› |
`rootValue?` | any |
`schema` | GraphQLSchema |
`subscribeFieldResolver?` | Maybe‹GraphQLFieldResolver‹any, any›› |
`variableValues?` | Maybe‹object› |

## Functions

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *SubscriptionsManagerInit*

*Defined in [main/index.ts:103](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/subscribe/src/main/index.ts#L103)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *SubscriptionsManagerInit*
