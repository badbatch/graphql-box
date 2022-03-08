[Documentation](README.md)

# Documentation

## Index

### Classes

* [Server](classes/server.md)

### Interfaces

* [RequestData](interfaces/requestdata.md)
* [ResponseDataWithMaybeDehydratedCacheMetadataBatch](interfaces/responsedatawithmaybedehydratedcachemetadatabatch.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [MessageHandler](README.md#messagehandler)
* [RequestHandler](README.md#requesthandler)

## Type aliases

###  MessageHandler

Ƭ **MessageHandler**: *function*

*Defined in [defs/index.ts:21](https://github.com/badbatch/graphql-box/blob/5221a9e/packages/server/src/defs/index.ts#L21)*

#### Type declaration:

▸ (`message`: Data): *void*

**Parameters:**

Name | Type |
------ | ------ |
`message` | Data |

___

###  RequestHandler

Ƭ **RequestHandler**: *function*

*Defined in [defs/index.ts:19](https://github.com/badbatch/graphql-box/blob/5221a9e/packages/server/src/defs/index.ts#L19)*

#### Type declaration:

▸ (`req`: Request, `res`: Response, ...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`req` | Request |
`res` | Response |
`...args` | any[] |
