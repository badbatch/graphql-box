[Documentation](../README.md) › [Server](server.md)

# Class: Server

## Hierarchy

* **Server**

## Index

### Constructors

* [constructor](server.md#constructor)

### Methods

* [log](server.md#log)
* [message](server.md#message)
* [request](server.md#request)

## Constructors

###  constructor

\+ **new Server**(`options`: [UserOptions](../interfaces/useroptions.md)): *[Server](server.md)*

*Defined in [main/index.ts:27](https://github.com/badbatch/graphql-box/blob/67c318bd/packages/server/src/main/index.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *[Server](server.md)*

## Methods

###  log

▸ **log**(): *[RequestHandler](../README.md#requesthandler)*

*Defined in [main/index.ts:49](https://github.com/badbatch/graphql-box/blob/67c318bd/packages/server/src/main/index.ts#L49)*

**Returns:** *[RequestHandler](../README.md#requesthandler)*

___

###  message

▸ **message**(`options`: ServerSocketRequestOptions): *[MessageHandler](../README.md#messagehandler)*

*Defined in [main/index.ts:55](https://github.com/badbatch/graphql-box/blob/67c318bd/packages/server/src/main/index.ts#L55)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | ServerSocketRequestOptions |

**Returns:** *[MessageHandler](../README.md#messagehandler)*

___

###  request

▸ **request**(`options`: ServerRequestOptions): *[RequestHandler](../README.md#requesthandler)*

*Defined in [main/index.ts:61](https://github.com/badbatch/graphql-box/blob/67c318bd/packages/server/src/main/index.ts#L61)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | ServerRequestOptions | {} |

**Returns:** *[RequestHandler](../README.md#requesthandler)*
