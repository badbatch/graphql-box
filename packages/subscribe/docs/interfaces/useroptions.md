[Documentation](../README.md) > [UserOptions](../interfaces/useroptions.md)

# Interface: UserOptions

## Hierarchy

**UserOptions**

## Index

### Properties

* [fieldResolver](useroptions.md#fieldresolver)
* [rootValue](useroptions.md#rootvalue)
* [schema](useroptions.md#schema)
* [subscribe](useroptions.md#subscribe)
* [subscribeFieldResolver](useroptions.md#subscribefieldresolver)

---

## Properties

<a id="fieldresolver"></a>

### `<Optional>` fieldResolver

**● fieldResolver**: *`GraphQLFieldResolver`<`any`, `any`>*

*Defined in [defs/index.ts:11](https://github.com/bad-batch/handl/blob/20503ed/packages/subscribe/src/defs/index.ts#L11)*

Set default GraphQL field resolver function to be passed on to GraphQL's execute and subscribe methods.

___
<a id="rootvalue"></a>

### `<Optional>` rootValue

**● rootValue**: *`any`*

*Defined in [defs/index.ts:17](https://github.com/bad-batch/handl/blob/20503ed/packages/subscribe/src/defs/index.ts#L17)*

Set default GraphQL root value to be passed on to GraphQL's execute and subscribe methods.

___
<a id="schema"></a>

###  schema

**● schema**: *`GraphQLSchema`*

*Defined in [defs/index.ts:22](https://github.com/bad-batch/handl/blob/20503ed/packages/subscribe/src/defs/index.ts#L22)*

The GraphQL schema.

___
<a id="subscribe"></a>

### `<Optional>` subscribe

**● subscribe**: *[GraphQLSubscribe](../#graphqlsubscribe)*

*Defined in [defs/index.ts:28](https://github.com/bad-batch/handl/blob/20503ed/packages/subscribe/src/defs/index.ts#L28)*

A GraphQL subscribe function to use instead of the out-of-the-box function.

___
<a id="subscribefieldresolver"></a>

### `<Optional>` subscribeFieldResolver

**● subscribeFieldResolver**: *`GraphQLFieldResolver`<`any`, `any`>*

*Defined in [defs/index.ts:33](https://github.com/bad-batch/handl/blob/20503ed/packages/subscribe/src/defs/index.ts#L33)*

Set default GraphQL subscribe field resolver function.

___

