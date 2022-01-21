[Documentation](../README.md) › [UserOptions](useroptions.md)

# Interface: UserOptions

## Hierarchy

* **UserOptions**

## Index

### Properties

* [contextValue](useroptions.md#optional-contextvalue)
* [fieldResolver](useroptions.md#optional-fieldresolver)
* [rootValue](useroptions.md#optional-rootvalue)
* [schema](useroptions.md#schema)
* [subscribe](useroptions.md#optional-subscribe)
* [subscribeFieldResolver](useroptions.md#optional-subscribefieldresolver)

## Properties

### `Optional` contextValue

• **contextValue**? : *PlainObjectMap*

*Defined in [packages/subscribe/src/defs/index.ts:11](https://github.com/badbatch/graphql-box/blob/b9b0d99/packages/subscribe/src/defs/index.ts#L11)*

Set GraphQL context value to be passed on to
GraphQL's execute and subscribe methods.

___

### `Optional` fieldResolver

• **fieldResolver**? : *GraphQLFieldResolver‹any, any›*

*Defined in [packages/subscribe/src/defs/index.ts:18](https://github.com/badbatch/graphql-box/blob/b9b0d99/packages/subscribe/src/defs/index.ts#L18)*

Set default GraphQL field resolver function to
be passed on to GraphQL's execute and subscribe
methods.

___

### `Optional` rootValue

• **rootValue**? : *any*

*Defined in [packages/subscribe/src/defs/index.ts:24](https://github.com/badbatch/graphql-box/blob/b9b0d99/packages/subscribe/src/defs/index.ts#L24)*

Set default GraphQL root value to be passed on to
GraphQL's execute and subscribe methods.

___

###  schema

• **schema**: *GraphQLSchema*

*Defined in [packages/subscribe/src/defs/index.ts:29](https://github.com/badbatch/graphql-box/blob/b9b0d99/packages/subscribe/src/defs/index.ts#L29)*

The GraphQL schema.

___

### `Optional` subscribe

• **subscribe**? : *[GraphQLSubscribe](../README.md#graphqlsubscribe)*

*Defined in [packages/subscribe/src/defs/index.ts:35](https://github.com/badbatch/graphql-box/blob/b9b0d99/packages/subscribe/src/defs/index.ts#L35)*

A GraphQL subscribe function to use
instead of the out-of-the-box function.

___

### `Optional` subscribeFieldResolver

• **subscribeFieldResolver**? : *GraphQLFieldResolver‹any, any›*

*Defined in [packages/subscribe/src/defs/index.ts:40](https://github.com/badbatch/graphql-box/blob/b9b0d99/packages/subscribe/src/defs/index.ts#L40)*

Set default GraphQL subscribe field resolver function.
