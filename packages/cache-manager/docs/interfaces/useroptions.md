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

*Defined in [cache-manager/src/defs/index.ts:24](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/cache-manager/src/defs/index.ts#L24)*

The cache to use for storing query responses, data entities,
and request field paths.

___

### `Optional` cascadeCacheControl

• **cascadeCacheControl**? : *undefined | false | true*

*Defined in [cache-manager/src/defs/index.ts:31](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/cache-manager/src/defs/index.ts#L31)*

Whether to cascade cache control directives down to
child nodes if a child node does not have its down
cache control directives.

___

### `Optional` fallbackOperationCacheability

• **fallbackOperationCacheability**? : *undefined | string*

*Defined in [cache-manager/src/defs/index.ts:38](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/cache-manager/src/defs/index.ts#L38)*

The cache control directive to apply to an operation
when none is provided in the response headers or the
operation's cache metadata.

___

### `Optional` typeCacheDirectives

• **typeCacheDirectives**? : *PlainObjectStringMap*

*Defined in [cache-manager/src/defs/index.ts:44](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/cache-manager/src/defs/index.ts#L44)*

An object map of GraphQL schema types to cache-control
directives used for caching object types.
