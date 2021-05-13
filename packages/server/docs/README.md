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

* [ConstructorOptions](README.md#constructoroptions)
* [MessageHandler](README.md#messagehandler)
* [RequestHandler](README.md#requesthandler)

## Type aliases

###  ConstructorOptions

Ƭ **ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:17](https://github.com/badbatch/graphql-box/blob/8c3dc0a/packages/server/src/defs/index.ts#L17)*

___

###  MessageHandler

Ƭ **MessageHandler**: *function*

*Defined in [defs/index.ts:21](https://github.com/badbatch/graphql-box/blob/8c3dc0a/packages/server/src/defs/index.ts#L21)*

#### Type declaration:

▸ (`message`: Data): *void*

**Parameters:**

Name | Type |
------ | ------ |
`message` | Data |

___

###  RequestHandler

Ƭ **RequestHandler**: *function*

*Defined in [defs/index.ts:19](https://github.com/badbatch/graphql-box/blob/8c3dc0a/packages/server/src/defs/index.ts#L19)*

#### Type declaration:

▸ (`req`: Request, `res`: Response, ...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`req` | Request |
`res` | Response |
`...args` | any[] |
