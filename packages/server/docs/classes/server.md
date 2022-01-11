[Documentation](../README.md) › [Server](server.md)

# Class: Server

## Hierarchy

* **Server**

## Index

### Constructors

* [constructor](server.md#constructor)

### Methods

* [message](server.md#message)
* [request](server.md#request)
* [init](server.md#static-init)

## Constructors

###  constructor

\+ **new Server**(`__namedParameters`: object): *[Server](server.md)*

*Defined in [main/index.ts:41](https://github.com/badbatch/graphql-box/blob/7c5a3cd/packages/server/src/main/index.ts#L41)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`client` | Client‹› |

**Returns:** *[Server](server.md)*

## Methods

###  message

▸ **message**(`options`: ServerSocketRequestOptions): *[MessageHandler](../README.md#messagehandler)*

*Defined in [main/index.ts:47](https://github.com/badbatch/graphql-box/blob/7c5a3cd/packages/server/src/main/index.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | ServerSocketRequestOptions |

**Returns:** *[MessageHandler](../README.md#messagehandler)*

___

###  request

▸ **request**(`options`: ServerRequestOptions): *[RequestHandler](../README.md#requesthandler)*

*Defined in [main/index.ts:53](https://github.com/badbatch/graphql-box/blob/7c5a3cd/packages/server/src/main/index.ts#L53)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | ServerRequestOptions | {} |

**Returns:** *[RequestHandler](../README.md#requesthandler)*

___

### `Static` init

▸ **init**(`options`: [UserOptions](../interfaces/useroptions.md)): *Promise‹[Server](server.md)›*

*Defined in [main/index.ts:25](https://github.com/badbatch/graphql-box/blob/7c5a3cd/packages/server/src/main/index.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *Promise‹[Server](server.md)›*
