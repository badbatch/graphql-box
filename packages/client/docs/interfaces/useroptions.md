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
* [typeIDKey](useroptions.md#optional-typeidkey)

## Properties

###  cacheManager

• **cacheManager**: *CacheManagerInit*

*Defined in [defs/index.ts:16](https://github.com/badbatch/graphql-box/blob/e00219a/packages/client/src/defs/index.ts#L16)*

The curried function to initialize the cache manager.

___

### `Optional` debugManager

• **debugManager**? : *DebugManagerInit*

*Defined in [defs/index.ts:21](https://github.com/badbatch/graphql-box/blob/e00219a/packages/client/src/defs/index.ts#L21)*

The curried function to initialize the debug manager.

___

###  requestManager

• **requestManager**: *RequestManagerInit*

*Defined in [defs/index.ts:26](https://github.com/badbatch/graphql-box/blob/e00219a/packages/client/src/defs/index.ts#L26)*

The curried function to initialize the request manager.

___

###  requestParser

• **requestParser**: *RequestParserInit*

*Defined in [defs/index.ts:31](https://github.com/badbatch/graphql-box/blob/e00219a/packages/client/src/defs/index.ts#L31)*

The curried function to initialzie the request parser.

___

### `Optional` subscriptionsManager

• **subscriptionsManager**? : *SubscriptionsManagerInit*

*Defined in [defs/index.ts:36](https://github.com/badbatch/graphql-box/blob/e00219a/packages/client/src/defs/index.ts#L36)*

The curried function to initialize the subscriptions manager.

___

### `Optional` typeIDKey

• **typeIDKey**? : *undefined | string*

*Defined in [defs/index.ts:42](https://github.com/badbatch/graphql-box/blob/e00219a/packages/client/src/defs/index.ts#L42)*

The name of the property thats value is used as the unique
identifier for each type in the GraphQL schema.
