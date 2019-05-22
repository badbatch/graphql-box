[Documentation](../README.md) > [UserOptions](../interfaces/useroptions.md)

# Interface: UserOptions

## Hierarchy

**UserOptions**

## Index

### Properties

* [cacheManager](useroptions.md#cachemanager)
* [debugManager](useroptions.md#debugmanager)
* [requestManager](useroptions.md#requestmanager)
* [requestParser](useroptions.md#requestparser)
* [subscriptionsManager](useroptions.md#subscriptionsmanager)
* [typeIDKey](useroptions.md#typeidkey)

---

## Properties

<a id="cachemanager"></a>

### `<Optional>` cacheManager

**● cacheManager**: *`CacheManagerInit`*

*Defined in [defs/index.ts:19](https://github.com/bad-batch/handl/blob/20503ed/packages/client/src/defs/index.ts#L19)*

The curried function to initialize the cache manager.

___
<a id="debugmanager"></a>

### `<Optional>` debugManager

**● debugManager**: *`DebugManagerInit`*

*Defined in [defs/index.ts:29](https://github.com/bad-batch/handl/blob/20503ed/packages/client/src/defs/index.ts#L29)*

The curried function to initialize the debug manager.

___
<a id="requestmanager"></a>

###  requestManager

**● requestManager**: *`RequestManagerInit`*

*Defined in [defs/index.ts:24](https://github.com/bad-batch/handl/blob/20503ed/packages/client/src/defs/index.ts#L24)*

The curried function to initialize the request manager.

___
<a id="requestparser"></a>

### `<Optional>` requestParser

**● requestParser**: *`RequestParserInit`*

*Defined in [defs/index.ts:34](https://github.com/bad-batch/handl/blob/20503ed/packages/client/src/defs/index.ts#L34)*

The curried function to initialzie the request parser.

___
<a id="subscriptionsmanager"></a>

### `<Optional>` subscriptionsManager

**● subscriptionsManager**: *`SubscriptionsManagerInit`*

*Defined in [defs/index.ts:39](https://github.com/bad-batch/handl/blob/20503ed/packages/client/src/defs/index.ts#L39)*

The curried function to initialize the subscriptions manager.

___
<a id="typeidkey"></a>

### `<Optional>` typeIDKey

**● typeIDKey**: *`undefined` \| `string`*

*Defined in [defs/index.ts:45](https://github.com/bad-batch/handl/blob/20503ed/packages/client/src/defs/index.ts#L45)*

The name of the property thats value is used as the unique identifier for each type in the GraphQL schema.

___

