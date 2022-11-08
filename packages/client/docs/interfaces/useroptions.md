[Documentation](../README.md) › [UserOptions](useroptions.md)

# Interface: UserOptions

## Hierarchy

* **UserOptions**

## Index

### Properties

* [cacheManager](useroptions.md#cachemanager)
* [debugManager](useroptions.md#optional-debugmanager)
* [requestManager](useroptions.md#requestmanager)
* [requestParser](useroptions.md#requestparser)
* [subscriptionsManager](useroptions.md#optional-subscriptionsmanager)

## Properties

###  cacheManager

• **cacheManager**: *CacheManagerDef*

*Defined in [defs/index.ts:19](https://github.com/badbatch/graphql-box/blob/f1852d90/packages/client/src/defs/index.ts#L19)*

The curried function to initialize the cache manager.

___

### `Optional` debugManager

• **debugManager**? : *DebugManagerDef*

*Defined in [defs/index.ts:24](https://github.com/badbatch/graphql-box/blob/f1852d90/packages/client/src/defs/index.ts#L24)*

The curried function to initialize the debug manager.

___

###  requestManager

• **requestManager**: *RequestManagerDef*

*Defined in [defs/index.ts:29](https://github.com/badbatch/graphql-box/blob/f1852d90/packages/client/src/defs/index.ts#L29)*

The request manager.

___

###  requestParser

• **requestParser**: *RequestParserDef*

*Defined in [defs/index.ts:34](https://github.com/badbatch/graphql-box/blob/f1852d90/packages/client/src/defs/index.ts#L34)*

The curried function to initialzie the request parser.

___

### `Optional` subscriptionsManager

• **subscriptionsManager**? : *SubscriptionsManagerDef*

*Defined in [defs/index.ts:39](https://github.com/badbatch/graphql-box/blob/f1852d90/packages/client/src/defs/index.ts#L39)*

The curried function to initialize the subscriptions manager.
