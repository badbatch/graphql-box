[Documentation](../README.md) › [UserOptions](useroptions.md)

# Interface: UserOptions

## Hierarchy

* **UserOptions**

## Index

### Properties

* [contextValue](useroptions.md#optional-contextvalue)
* [execute](useroptions.md#optional-execute)
* [fieldResolver](useroptions.md#optional-fieldresolver)
* [rootValue](useroptions.md#optional-rootvalue)
* [schema](useroptions.md#schema)

## Properties

### `Optional` contextValue

• **contextValue**? : *PlainObjectMap*

*Defined in [defs/index.ts:10](https://github.com/badbatch/graphql-box/blob/e966cb9b/packages/execute/src/defs/index.ts#L10)*

Set GraphQL context value to be passed on to
GraphQL's execute and subscribe methods.

___

### `Optional` execute

• **execute**? : *[GraphQLExecute](../README.md#graphqlexecute)*

*Defined in [defs/index.ts:16](https://github.com/badbatch/graphql-box/blob/e966cb9b/packages/execute/src/defs/index.ts#L16)*

A GraphQL execute function to use
instead of the out-of-the-box function.

___

### `Optional` fieldResolver

• **fieldResolver**? : *GraphQLFieldResolver‹any, any›*

*Defined in [defs/index.ts:23](https://github.com/badbatch/graphql-box/blob/e966cb9b/packages/execute/src/defs/index.ts#L23)*

Set default GraphQL field resolver function to
be passed on to GraphQL's execute and subscribe
methods.

___

### `Optional` rootValue

• **rootValue**? : *any*

*Defined in [defs/index.ts:29](https://github.com/badbatch/graphql-box/blob/e966cb9b/packages/execute/src/defs/index.ts#L29)*

Set default GraphQL root value to be passed on to
GraphQL's execute and subscribe methods.

___

###  schema

• **schema**: *GraphQLSchema*

*Defined in [defs/index.ts:34](https://github.com/badbatch/graphql-box/blob/e966cb9b/packages/execute/src/defs/index.ts#L34)*

The GraphQL schema.
