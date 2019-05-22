[Documentation](../README.md) > [UserOptions](../interfaces/useroptions.md)

# Interface: UserOptions

## Hierarchy

**UserOptions**

## Index

### Properties

* [execute](useroptions.md#execute)
* [fieldResolver](useroptions.md#fieldresolver)
* [rootValue](useroptions.md#rootvalue)
* [schema](useroptions.md#schema)

---

## Properties

<a id="execute"></a>

### `<Optional>` execute

**● execute**: *[GraphQLExecute](../#graphqlexecute)*

*Defined in [defs/index.ts:10](https://github.com/bad-batch/handl/blob/20503ed/packages/execute/src/defs/index.ts#L10)*

A GraphQL execute function to use instead of the out-of-the-box function.

___
<a id="fieldresolver"></a>

### `<Optional>` fieldResolver

**● fieldResolver**: *`GraphQLFieldResolver`<`any`, `any`>*

*Defined in [defs/index.ts:17](https://github.com/bad-batch/handl/blob/20503ed/packages/execute/src/defs/index.ts#L17)*

Set default GraphQL field resolver function to be passed on to GraphQL's execute and subscribe methods.

___
<a id="rootvalue"></a>

### `<Optional>` rootValue

**● rootValue**: *`any`*

*Defined in [defs/index.ts:23](https://github.com/bad-batch/handl/blob/20503ed/packages/execute/src/defs/index.ts#L23)*

Set default GraphQL root value to be passed on to GraphQL's execute and subscribe methods.

___
<a id="schema"></a>

###  schema

**● schema**: *`GraphQLSchema`*

*Defined in [defs/index.ts:28](https://github.com/bad-batch/handl/blob/20503ed/packages/execute/src/defs/index.ts#L28)*

The GraphQL schema.

___

