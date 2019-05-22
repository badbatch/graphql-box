
#  Documentation

## Index

### Classes

* [Server](classes/server.md)

### Interfaces

* [RequestData](interfaces/requestdata.md)
* [ResponseDataWithMaybeDehydratedCacheMetadataBatch](interfaces/responsedatawithmaybedehydratedcachemetadatabatch.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [ConstructorOptions](#constructoroptions)
* [MessageHandler](#messagehandler)
* [RequestHandler](#requesthandler)

---

## Type aliases

<a id="constructoroptions"></a>

###  ConstructorOptions

**Ƭ ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:17](https://github.com/bad-batch/handl/blob/20503ed/packages/server/src/defs/index.ts#L17)*

___
<a id="messagehandler"></a>

###  MessageHandler

**Ƭ MessageHandler**: *`function`*

*Defined in [defs/index.ts:21](https://github.com/bad-batch/handl/blob/20503ed/packages/server/src/defs/index.ts#L21)*

#### Type declaration
▸(message: *`Data`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| message | `Data` |

**Returns:** `void`

___
<a id="requesthandler"></a>

###  RequestHandler

**Ƭ RequestHandler**: *`function`*

*Defined in [defs/index.ts:19](https://github.com/bad-batch/handl/blob/20503ed/packages/server/src/defs/index.ts#L19)*

#### Type declaration
▸(req: *`Request`*, res: *`Response`*, ...args: *`any`[]*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| req | `Request` |
| res | `Response` |
| `Rest` args | `any`[] |

**Returns:** `void`

___

