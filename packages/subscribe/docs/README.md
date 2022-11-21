[Documentation](README.md)

# Documentation

## Index

### Classes

* [Subscribe](classes/subscribe.md)

### Interfaces

* [SubscribeArgs](interfaces/subscribeargs.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [GraphQLSubscribe](README.md#graphqlsubscribe)

## Type aliases

###  GraphQLSubscribe

Ƭ **GraphQLSubscribe**: *function*

*Defined in [defs/index.ts:42](https://github.com/badbatch/graphql-box/blob/e966cb9b/packages/subscribe/src/defs/index.ts#L42)*

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
