[Documentation](../README.md) › [UserOptions](useroptions.md)

# Interface: UserOptions

## Hierarchy

* **UserOptions**

## Index

### Properties

* [apiUrl](useroptions.md#optional-apiurl)
* [batchRequests](useroptions.md#optional-batchrequests)
* [batchResponses](useroptions.md#optional-batchresponses)
* [fetchTimeout](useroptions.md#optional-fetchtimeout)
* [headers](useroptions.md#optional-headers)
* [logUrl](useroptions.md#optional-logurl)
* [requestBatchInterval](useroptions.md#optional-requestbatchinterval)
* [requestBatchMax](useroptions.md#optional-requestbatchmax)
* [responseBatchInterval](useroptions.md#optional-responsebatchinterval)

## Properties

### `Optional` apiUrl

• **apiUrl**? : *undefined | string*

*Defined in [defs/index.ts:9](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/fetch-manager/src/defs/index.ts#L9)*

The endpoint that client will use to communicate with the
GraphQL server for queries and mutations.

___

### `Optional` batchRequests

• **batchRequests**? : *undefined | false | true*

*Defined in [defs/index.ts:15](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/fetch-manager/src/defs/index.ts#L15)*

Whether a client should batch requests query and mutation
requests.

___

### `Optional` batchResponses

• **batchResponses**? : *undefined | false | true*

*Defined in [defs/index.ts:21](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/fetch-manager/src/defs/index.ts#L21)*

Whether a client should batch responses when receiving
patches for requests using defer or stream.

___

### `Optional` fetchTimeout

• **fetchTimeout**? : *undefined | number*

*Defined in [defs/index.ts:27](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/fetch-manager/src/defs/index.ts#L27)*

How long client should wait for a server to
respond before timing out.

___

### `Optional` headers

• **headers**? : *PlainObjectStringMap*

*Defined in [defs/index.ts:32](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/fetch-manager/src/defs/index.ts#L32)*

Additional headers to be sent with every request.

___

### `Optional` logUrl

• **logUrl**? : *undefined | string*

*Defined in [defs/index.ts:38](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/fetch-manager/src/defs/index.ts#L38)*

The endpoint that client will use to send logs
to the server.

___

### `Optional` requestBatchInterval

• **requestBatchInterval**? : *undefined | number*

*Defined in [defs/index.ts:44](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/fetch-manager/src/defs/index.ts#L44)*

How long client should wait to batch requests
before making a request.

___

### `Optional` requestBatchMax

• **requestBatchMax**? : *undefined | number*

*Defined in [defs/index.ts:49](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/fetch-manager/src/defs/index.ts#L49)*

The maximum number of requests in a single batch

___

### `Optional` responseBatchInterval

• **responseBatchInterval**? : *undefined | number*

*Defined in [defs/index.ts:55](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/fetch-manager/src/defs/index.ts#L55)*

How long client should wait to batch responses
before returning a response.
