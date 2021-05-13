[Documentation](../README.md) › [UserOptions](useroptions.md)

# Interface: UserOptions

## Hierarchy

* **UserOptions**

## Index

### Properties

* [batch](useroptions.md#optional-batch)
* [batchInterval](useroptions.md#optional-batchinterval)
* [fetchTimeout](useroptions.md#optional-fetchtimeout)
* [headers](useroptions.md#optional-headers)
* [url](useroptions.md#url)

## Properties

### `Optional` batch

• **batch**? : *undefined | false | true*

*Defined in [defs/index.ts:8](https://github.com/badbatch/graphql-box/blob/8c3dc0a/packages/fetch-manager/src/defs/index.ts#L8)*

Whether a client should batch query and mutation
requests.

___

### `Optional` batchInterval

• **batchInterval**? : *undefined | number*

*Defined in [defs/index.ts:14](https://github.com/badbatch/graphql-box/blob/8c3dc0a/packages/fetch-manager/src/defs/index.ts#L14)*

How long client should wait to batch requests
before making a request.

___

### `Optional` fetchTimeout

• **fetchTimeout**? : *undefined | number*

*Defined in [defs/index.ts:20](https://github.com/badbatch/graphql-box/blob/8c3dc0a/packages/fetch-manager/src/defs/index.ts#L20)*

How long client should wait for a server to
respond before timing out.

___

### `Optional` headers

• **headers**? : *PlainObjectStringMap*

*Defined in [defs/index.ts:25](https://github.com/badbatch/graphql-box/blob/8c3dc0a/packages/fetch-manager/src/defs/index.ts#L25)*

Additional headers to be sent with every request.

___

###  url

• **url**: *string*

*Defined in [defs/index.ts:31](https://github.com/badbatch/graphql-box/blob/8c3dc0a/packages/fetch-manager/src/defs/index.ts#L31)*

The endpoint that client will use to communicate with the
GraphQL server for queries and mutations.
