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
* [InitOptions](README.md#initoptions)

### Functions

* [init](README.md#init)

## Type aliases

###  ConstructorOptions

Ƭ **ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [packages/subscribe/src/defs/index.ts:45](https://github.com/badbatch/graphql-box/blob/8313ce9/packages/subscribe/src/defs/index.ts#L45)*

___

###  GraphQLSubscribe

Ƭ **GraphQLSubscribe**: *function*

*Defined in [packages/subscribe/src/defs/index.ts:47](https://github.com/badbatch/graphql-box/blob/8313ce9/packages/subscribe/src/defs/index.ts#L47)*

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

___

###  InitOptions

Ƭ **InitOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [packages/subscribe/src/defs/index.ts:43](https://github.com/badbatch/graphql-box/blob/8313ce9/packages/subscribe/src/defs/index.ts#L43)*

## Functions

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *SubscriptionsManagerInit*

*Defined in [packages/subscribe/src/main/index.ts:85](https://github.com/badbatch/graphql-box/blob/8313ce9/packages/subscribe/src/main/index.ts#L85)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *SubscriptionsManagerInit*
