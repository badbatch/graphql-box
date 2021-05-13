[Documentation](../README.md) › [UserOptions](useroptions.md)

# Interface: UserOptions

## Hierarchy

* **UserOptions**

## Index

### Properties

* [fieldResolver](useroptions.md#optional-fieldresolver)
* [rootValue](useroptions.md#optional-rootvalue)
* [schema](useroptions.md#schema)
* [subscribe](useroptions.md#optional-subscribe)
* [subscribeFieldResolver](useroptions.md#optional-subscribefieldresolver)

## Properties

### `Optional` fieldResolver

• **fieldResolver**? : *GraphQLFieldResolver‹any, any›*

*Defined in [packages/subscribe/src/defs/index.ts:11](https://github.com/badbatch/graphql-box/blob/8c3dc0a/packages/subscribe/src/defs/index.ts#L11)*

Set default GraphQL field resolver function to
be passed on to GraphQL's execute and subscribe
methods.

___

### `Optional` rootValue

• **rootValue**? : *any*

*Defined in [packages/subscribe/src/defs/index.ts:17](https://github.com/badbatch/graphql-box/blob/8c3dc0a/packages/subscribe/src/defs/index.ts#L17)*

Set default GraphQL root value to be passed on to
GraphQL's execute and subscribe methods.

___

###  schema

• **schema**: *GraphQLSchema*

*Defined in [packages/subscribe/src/defs/index.ts:22](https://github.com/badbatch/graphql-box/blob/8c3dc0a/packages/subscribe/src/defs/index.ts#L22)*

The GraphQL schema.

___

### `Optional` subscribe

• **subscribe**? : *[GraphQLSubscribe](../README.md#graphqlsubscribe)*

*Defined in [packages/subscribe/src/defs/index.ts:28](https://github.com/badbatch/graphql-box/blob/8c3dc0a/packages/subscribe/src/defs/index.ts#L28)*

A GraphQL subscribe function to use
instead of the out-of-the-box function.

___

### `Optional` subscribeFieldResolver

• **subscribeFieldResolver**? : *GraphQLFieldResolver‹any, any›*

*Defined in [packages/subscribe/src/defs/index.ts:33](https://github.com/badbatch/graphql-box/blob/8c3dc0a/packages/subscribe/src/defs/index.ts#L33)*

Set default GraphQL subscribe field resolver function.
