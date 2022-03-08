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

*Defined in [defs/index.ts:10](https://github.com/badbatch/graphql-box/blob/6718c4a/packages/subscribe/src/defs/index.ts#L10)*

Set GraphQL context value to be passed on to
GraphQL's execute and subscribe methods.

___

### `Optional` fieldResolver

• **fieldResolver**? : *GraphQLFieldResolver‹any, any›*

*Defined in [defs/index.ts:17](https://github.com/badbatch/graphql-box/blob/6718c4a/packages/subscribe/src/defs/index.ts#L17)*

Set default GraphQL field resolver function to
be passed on to GraphQL's execute and subscribe
methods.

___

### `Optional` rootValue

• **rootValue**? : *any*

*Defined in [defs/index.ts:23](https://github.com/badbatch/graphql-box/blob/6718c4a/packages/subscribe/src/defs/index.ts#L23)*

Set default GraphQL root value to be passed on to
GraphQL's execute and subscribe methods.

___

###  schema

• **schema**: *GraphQLSchema*

*Defined in [defs/index.ts:28](https://github.com/badbatch/graphql-box/blob/6718c4a/packages/subscribe/src/defs/index.ts#L28)*

The GraphQL schema.

___

### `Optional` subscribe

• **subscribe**? : *[GraphQLSubscribe](../README.md#graphqlsubscribe)*

*Defined in [defs/index.ts:34](https://github.com/badbatch/graphql-box/blob/6718c4a/packages/subscribe/src/defs/index.ts#L34)*

A GraphQL subscribe function to use
instead of the out-of-the-box function.

___

### `Optional` subscribeFieldResolver

• **subscribeFieldResolver**? : *GraphQLFieldResolver‹any, any›*

*Defined in [defs/index.ts:39](https://github.com/badbatch/graphql-box/blob/6718c4a/packages/subscribe/src/defs/index.ts#L39)*

Set default GraphQL subscribe field resolver function.
