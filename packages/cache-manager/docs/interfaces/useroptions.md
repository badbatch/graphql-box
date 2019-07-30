> **[Documentation](../README.md)**

[UserOptions](useroptions.md) /

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

• **cache**: *`Cachemap`*

*Defined in [defs/index.ts:22](https://github.com/badbatch/graphql-box/blob/22b398c/packages/cache-manager/src/defs/index.ts#L22)*

The cache to use for storing query responses, data entities,
and request field paths.

___

### `Optional` cascadeCacheControl

• **cascadeCacheControl**? : *undefined | false | true*

*Defined in [defs/index.ts:29](https://github.com/badbatch/graphql-box/blob/22b398c/packages/cache-manager/src/defs/index.ts#L29)*

Whether to cascade cache control directives down to
child nodes if a child node does not have its down
cache control directives.

___

### `Optional` fallbackOperationCacheability

• **fallbackOperationCacheability**? : *undefined | string*

*Defined in [defs/index.ts:36](https://github.com/badbatch/graphql-box/blob/22b398c/packages/cache-manager/src/defs/index.ts#L36)*

The cache control directive to apply to an operation
when none is provided in the response headers or the
operation's cache metadata.

___

### `Optional` typeCacheDirectives

• **typeCacheDirectives**? : *`PlainObjectStringMap`*

*Defined in [defs/index.ts:42](https://github.com/badbatch/graphql-box/blob/22b398c/packages/cache-manager/src/defs/index.ts#L42)*

An object map of GraphQL schema types to cache-control
directives used for caching object types.