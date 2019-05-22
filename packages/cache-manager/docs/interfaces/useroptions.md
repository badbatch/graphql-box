[Documentation](../README.md) > [UserOptions](../interfaces/useroptions.md)

# Interface: UserOptions

## Hierarchy

**UserOptions**

## Index

### Properties

* [cache](useroptions.md#cache)
* [cascadeCacheControl](useroptions.md#cascadecachecontrol)
* [fallbackOperationCacheability](useroptions.md#fallbackoperationcacheability)
* [typeCacheDirectives](useroptions.md#typecachedirectives)

---

## Properties

<a id="cache"></a>

###  cache

**● cache**: *`Cachemap`*

*Defined in [defs/index.ts:22](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/defs/index.ts#L22)*

The cache to use for storing query responses, data entities, and request field paths.

___
<a id="cascadecachecontrol"></a>

### `<Optional>` cascadeCacheControl

**● cascadeCacheControl**: *`undefined` \| `false` \| `true`*

*Defined in [defs/index.ts:29](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/defs/index.ts#L29)*

Whether to cascade cache control directives down to child nodes if a child node does not have its down cache control directives.

___
<a id="fallbackoperationcacheability"></a>

### `<Optional>` fallbackOperationCacheability

**● fallbackOperationCacheability**: *`undefined` \| `string`*

*Defined in [defs/index.ts:36](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/defs/index.ts#L36)*

The cache control directive to apply to an operation when none is provided in the response headers or the operation's cache metadata.

___
<a id="typecachedirectives"></a>

### `<Optional>` typeCacheDirectives

**● typeCacheDirectives**: *`PlainObjectStringMap`*

*Defined in [defs/index.ts:42](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/defs/index.ts#L42)*

An object map of GraphQL schema types to cache-control directives used for caching object types.

___

