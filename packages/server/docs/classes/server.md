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

*Defined in [main/index.ts:42](https://github.com/badbatch/graphql-box/blob/d6cf575/packages/server/src/main/index.ts#L42)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`client` | Client‹› |

**Returns:** *[Server](server.md)*

## Methods

###  message

▸ **message**(`options`: ServerSocketRequestOptions): *[MessageHandler](../README.md#messagehandler)*

*Defined in [main/index.ts:48](https://github.com/badbatch/graphql-box/blob/d6cf575/packages/server/src/main/index.ts#L48)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | ServerSocketRequestOptions |

**Returns:** *[MessageHandler](../README.md#messagehandler)*

___

###  request

▸ **request**(`options`: ServerRequestOptions): *[RequestHandler](../README.md#requesthandler)*

*Defined in [main/index.ts:54](https://github.com/badbatch/graphql-box/blob/d6cf575/packages/server/src/main/index.ts#L54)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | ServerRequestOptions | {} |

**Returns:** *[RequestHandler](../README.md#requesthandler)*

___

### `Static` init

▸ **init**(`options`: [UserOptions](../interfaces/useroptions.md)): *Promise‹[Server](server.md)›*

*Defined in [main/index.ts:26](https://github.com/badbatch/graphql-box/blob/d6cf575/packages/server/src/main/index.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *Promise‹[Server](server.md)›*
