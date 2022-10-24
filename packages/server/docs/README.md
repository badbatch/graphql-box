[Documentation](README.md)

# Documentation

## Index

### Classes

* [Server](classes/server.md)

### Interfaces

* [BatchRequestData](interfaces/batchrequestdata.md)
* [LogData](interfaces/logdata.md)
* [RequestData](interfaces/requestdata.md)
* [ResponseDataWithMaybeDehydratedCacheMetadataBatch](interfaces/responsedatawithmaybedehydratedcachemetadatabatch.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [MessageHandler](README.md#messagehandler)
* [RequestHandler](README.md#requesthandler)

## Type aliases

###  MessageHandler

Ƭ **MessageHandler**: *function*

*Defined in [defs/index.ts:31](https://github.com/badbatch/graphql-box/blob/75cbc234/packages/server/src/defs/index.ts#L31)*

#### Type declaration:

▸ (`message`: Data): *void*

**Parameters:**

Name | Type |
------ | ------ |
`message` | Data |

___

###  RequestHandler

Ƭ **RequestHandler**: *function*

*Defined in [defs/index.ts:29](https://github.com/badbatch/graphql-box/blob/75cbc234/packages/server/src/defs/index.ts#L29)*

#### Type declaration:

▸ (`req`: Request, `res`: Response, ...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`req` | Request |
`res` | Response |
`...args` | any[] |
