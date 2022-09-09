[Documentation](../README.md) › [UserOptions](useroptions.md)

# Interface: UserOptions

## Hierarchy

* **UserOptions**

## Index

### Properties

* [client](useroptions.md#client)
* [requestTimeout](useroptions.md#optional-requesttimeout)
* [requestWhitelist](useroptions.md#optional-requestwhitelist)

## Properties

###  client

• **client**: *Client*

*Defined in [defs/index.ts:15](https://github.com/badbatch/graphql-box/blob/4e42c8bb/packages/server/src/defs/index.ts#L15)*

The client.

___

### `Optional` requestTimeout

• **requestTimeout**? : *undefined | number*

*Defined in [defs/index.ts:20](https://github.com/badbatch/graphql-box/blob/4e42c8bb/packages/server/src/defs/index.ts#L20)*

Time the server has to process a request before timing out.

___

### `Optional` requestWhitelist

• **requestWhitelist**? : *string[]*

*Defined in [defs/index.ts:26](https://github.com/badbatch/graphql-box/blob/4e42c8bb/packages/server/src/defs/index.ts#L26)*

List of request hashes that the server is allowed to
operate on.
