[Documentation](../README.md) › [UserOptions](useroptions.md)

# Interface: UserOptions

## Hierarchy

* **UserOptions**

## Index

### Properties

* [batchRequests](useroptions.md#optional-batchrequests)
* [batchResponses](useroptions.md#optional-batchresponses)
* [fetchTimeout](useroptions.md#optional-fetchtimeout)
* [headers](useroptions.md#optional-headers)
* [requestBatchInterval](useroptions.md#optional-requestbatchinterval)
* [responseBatchInterval](useroptions.md#optional-responsebatchinterval)
* [url](useroptions.md#url)

## Properties

### `Optional` batchRequests

• **batchRequests**? : *undefined | false | true*

*Defined in [defs/index.ts:8](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/fetch-manager/src/defs/index.ts#L8)*

Whether a client should batch requests query and mutation
requests.

___

### `Optional` batchResponses

• **batchResponses**? : *undefined | false | true*

*Defined in [defs/index.ts:14](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/fetch-manager/src/defs/index.ts#L14)*

Whether a client should batch responses when receiving
patches for requests using defer or stream.

___

### `Optional` fetchTimeout

• **fetchTimeout**? : *undefined | number*

*Defined in [defs/index.ts:20](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/fetch-manager/src/defs/index.ts#L20)*

How long client should wait for a server to
respond before timing out.

___

### `Optional` headers

• **headers**? : *PlainObjectStringMap*

*Defined in [defs/index.ts:25](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/fetch-manager/src/defs/index.ts#L25)*

Additional headers to be sent with every request.

___

### `Optional` requestBatchInterval

• **requestBatchInterval**? : *undefined | number*

*Defined in [defs/index.ts:31](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/fetch-manager/src/defs/index.ts#L31)*

How long client should wait to batch requests
before making a request.

___

### `Optional` responseBatchInterval

• **responseBatchInterval**? : *undefined | number*

*Defined in [defs/index.ts:37](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/fetch-manager/src/defs/index.ts#L37)*

How long client should wait to batch responses
before returning a response.

___

###  url

• **url**: *string*

*Defined in [defs/index.ts:43](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/fetch-manager/src/defs/index.ts#L43)*

The endpoint that client will use to communicate with the
GraphQL server for queries and mutations.
