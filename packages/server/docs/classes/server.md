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

## Constructors

###  constructor

\+ **new Server**(`options`: [UserOptions](../interfaces/useroptions.md)): *[Server](server.md)*

*Defined in [main/index.ts:26](https://github.com/badbatch/graphql-box/blob/3fa1e6d/packages/server/src/main/index.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *[Server](server.md)*

## Methods

###  message

▸ **message**(`options`: ServerSocketRequestOptions): *[MessageHandler](../README.md#messagehandler)*

*Defined in [main/index.ts:48](https://github.com/badbatch/graphql-box/blob/3fa1e6d/packages/server/src/main/index.ts#L48)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | ServerSocketRequestOptions |

**Returns:** *[MessageHandler](../README.md#messagehandler)*

___

###  request

▸ **request**(`options`: ServerRequestOptions): *[RequestHandler](../README.md#requesthandler)*

*Defined in [main/index.ts:54](https://github.com/badbatch/graphql-box/blob/3fa1e6d/packages/server/src/main/index.ts#L54)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | ServerRequestOptions | {} |

**Returns:** *[RequestHandler](../README.md#requesthandler)*
