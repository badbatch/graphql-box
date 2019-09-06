**[Documentation](../README.md)**

[Globals](../README.md) › [UserOptions](useroptions.md)

# Interface: UserOptions

## Hierarchy

* **UserOptions**

## Index

### Properties

* [execute](useroptions.md#optional-execute)
* [fieldResolver](useroptions.md#optional-fieldresolver)
* [rootValue](useroptions.md#optional-rootvalue)
* [schema](useroptions.md#schema)

## Properties

### `Optional` execute

• **execute**? : *[GraphQLExecute](../README.md#graphqlexecute)*

*Defined in [defs/index.ts:10](https://github.com/badbatch/graphql-box/blob/2d19c63/packages/execute/src/defs/index.ts#L10)*

A GraphQL execute function to use
instead of the out-of-the-box function.

___

### `Optional` fieldResolver

• **fieldResolver**? : *GraphQLFieldResolver‹any, any›*

*Defined in [defs/index.ts:17](https://github.com/badbatch/graphql-box/blob/2d19c63/packages/execute/src/defs/index.ts#L17)*

Set default GraphQL field resolver function to
be passed on to GraphQL's execute and subscribe
methods.

___

### `Optional` rootValue

• **rootValue**? : *any*

*Defined in [defs/index.ts:23](https://github.com/badbatch/graphql-box/blob/2d19c63/packages/execute/src/defs/index.ts#L23)*

Set default GraphQL root value to be passed on to
GraphQL's execute and subscribe methods.

___

###  schema

• **schema**: *GraphQLSchema*

*Defined in [defs/index.ts:28](https://github.com/badbatch/graphql-box/blob/2d19c63/packages/execute/src/defs/index.ts#L28)*

The GraphQL schema.