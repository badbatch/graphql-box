[Documentation](../README.md) › [UserOptions](useroptions.md)

# Interface: UserOptions

## Hierarchy

* **UserOptions**

## Index

### Properties

* [cache](useroptions.md#cache)
* [cascadeCacheControl](useroptions.md#optional-cascadecachecontrol)
* [fallbackOperationCacheability](useroptions.md#optional-fallbackoperationcacheability)
* [typeCacheDirectives](useroptions.md#optional-typecachedirectives)

## Properties

###  cache

• **cache**: *Cachemap*

*Defined in [cache-manager/src/defs/index.ts:23](https://github.com/badbatch/graphql-box/blob/bf31fdc/packages/cache-manager/src/defs/index.ts#L23)*

The cache to use for storing query responses, data entities,
and request field paths.

___

### `Optional` cascadeCacheControl

• **cascadeCacheControl**? : *undefined | false | true*

*Defined in [cache-manager/src/defs/index.ts:30](https://github.com/badbatch/graphql-box/blob/bf31fdc/packages/cache-manager/src/defs/index.ts#L30)*

Whether to cascade cache control directives down to
child nodes if a child node does not have its down
cache control directives.

___

### `Optional` fallbackOperationCacheability

• **fallbackOperationCacheability**? : *undefined | string*

*Defined in [cache-manager/src/defs/index.ts:37](https://github.com/badbatch/graphql-box/blob/bf31fdc/packages/cache-manager/src/defs/index.ts#L37)*

The cache control directive to apply to an operation
when none is provided in the response headers or the
operation's cache metadata.

___

### `Optional` typeCacheDirectives

• **typeCacheDirectives**? : *PlainObjectStringMap*

*Defined in [cache-manager/src/defs/index.ts:43](https://github.com/badbatch/graphql-box/blob/bf31fdc/packages/cache-manager/src/defs/index.ts#L43)*

An object map of GraphQL schema types to cache-control
directives used for caching object types.
