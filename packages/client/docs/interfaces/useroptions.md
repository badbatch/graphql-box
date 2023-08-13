[Documentation](../README.md) › [UserOptions](useroptions.md)

# Interface: UserOptions

## Hierarchy

* **UserOptions**

## Index

### Properties

* [cacheManager](useroptions.md#cachemanager)
* [debugManager](useroptions.md#optional-debugmanager)
* [experimentalDeferStreamSupport](useroptions.md#optional-experimentaldeferstreamsupport)
* [requestManager](useroptions.md#requestmanager)
* [requestParser](useroptions.md#requestparser)
* [subscriptionsManager](useroptions.md#optional-subscriptionsmanager)

## Properties

###  cacheManager

• **cacheManager**: *CacheManagerDef*

*Defined in [defs/index.ts:19](https://github.com/badbatch/graphql-box/blob/870b4903/packages/client/src/defs/index.ts#L19)*

The curried function to initialize the cache manager.

___

### `Optional` debugManager

• **debugManager**? : *DebugManagerDef*

*Defined in [defs/index.ts:24](https://github.com/badbatch/graphql-box/blob/870b4903/packages/client/src/defs/index.ts#L24)*

The curried function to initialize the debug manager.

___

### `Optional` experimentalDeferStreamSupport

• **experimentalDeferStreamSupport**? : *undefined | false | true*

*Defined in [defs/index.ts:30](https://github.com/badbatch/graphql-box/blob/870b4903/packages/client/src/defs/index.ts#L30)*

Enable support for defer and stream directives. Based on version
of spec in 16.1.0-experimental-stream-defer.6

___

###  requestManager

• **requestManager**: *RequestManagerDef*

*Defined in [defs/index.ts:35](https://github.com/badbatch/graphql-box/blob/870b4903/packages/client/src/defs/index.ts#L35)*

The request manager.

___

###  requestParser

• **requestParser**: *RequestParserDef*

*Defined in [defs/index.ts:40](https://github.com/badbatch/graphql-box/blob/870b4903/packages/client/src/defs/index.ts#L40)*

The curried function to initialzie the request parser.

___

### `Optional` subscriptionsManager

• **subscriptionsManager**? : *SubscriptionsManagerDef*

*Defined in [defs/index.ts:45](https://github.com/badbatch/graphql-box/blob/870b4903/packages/client/src/defs/index.ts#L45)*

The curried function to initialize the subscriptions manager.
