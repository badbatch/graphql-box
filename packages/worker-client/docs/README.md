[Documentation](README.md)

# Documentation

## Index

### Classes

* [WorkerClient](classes/workerclient.md)

### Interfaces

* [MessageContext](interfaces/messagecontext.md)
* [MessageRequestPayload](interfaces/messagerequestpayload.md)
* [MessageResponsePayload](interfaces/messageresponsepayload.md)
* [PendingData](interfaces/pendingdata.md)
* [RegisterWorkerOptions](interfaces/registerworkeroptions.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [MethodNames](README.md#methodnames)
* [PendingResolver](README.md#pendingresolver)
* [PendingTracker](README.md#pendingtracker)

### Variables

* [CACHEMAP](README.md#const-cachemap)
* [GRAPHQL_BOX](README.md#const-graphql_box)
* [MESSAGE](README.md#const-message)
* [REQUEST](README.md#const-request)
* [SUBSCRIBE](README.md#const-subscribe)
* [addEventListener](README.md#addeventlistener)
* [postMessage](README.md#postmessage)

### Functions

* [handleMessage](README.md#handlemessage)
* [handleRequest](README.md#handlerequest)
* [handleSubscription](README.md#handlesubscription)
* [logRequest](README.md#logrequest)
* [logSubscription](README.md#logsubscription)
* [registerWorker](README.md#registerworker)

## Type aliases

###  MethodNames

Ƭ **MethodNames**: *"request" | "subscribe"*

*Defined in [defs/index.ts:23](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/worker-client/src/defs/index.ts#L23)*

___

###  PendingResolver

Ƭ **PendingResolver**: *function*

*Defined in [defs/index.ts:25](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/worker-client/src/defs/index.ts#L25)*

#### Type declaration:

▸ (`value`: MaybeRequestResult): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | MaybeRequestResult |

___

###  PendingTracker

Ƭ **PendingTracker**: *Map‹string, [PendingData](interfaces/pendingdata.md)›*

*Defined in [defs/index.ts:31](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/worker-client/src/defs/index.ts#L31)*

## Variables

### `Const` CACHEMAP

• **CACHEMAP**: *"cachemap"* = "cachemap"

*Defined in [consts/index.ts:7](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/worker-client/src/consts/index.ts#L7)*

___

### `Const` GRAPHQL_BOX

• **GRAPHQL_BOX**: *"graphqlBox"* = "graphqlBox"

*Defined in [consts/index.ts:6](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/worker-client/src/consts/index.ts#L6)*

___

### `Const` MESSAGE

• **MESSAGE**: *"message"* = "message"

*Defined in [consts/index.ts:4](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/worker-client/src/consts/index.ts#L4)*

___

### `Const` REQUEST

• **REQUEST**: *"request"* = "request"

*Defined in [consts/index.ts:1](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/worker-client/src/consts/index.ts#L1)*

___

### `Const` SUBSCRIBE

• **SUBSCRIBE**: *"subscribe"* = "subscribe"

*Defined in [consts/index.ts:2](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/worker-client/src/consts/index.ts#L2)*

___

###  addEventListener

• **addEventListener**: *addEventListener*

*Defined in [register-worker/index.ts:10](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/worker-client/src/register-worker/index.ts#L10)*

___

###  postMessage

• **postMessage**: *postMessage*

*Defined in [register-worker/index.ts:10](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/worker-client/src/register-worker/index.ts#L10)*

## Functions

###  handleMessage

▸ **handleMessage**(`data`: [MessageRequestPayload](interfaces/messagerequestpayload.md), `client`: Client): *void*

*Defined in [register-worker/index.ts:69](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/worker-client/src/register-worker/index.ts#L69)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | [MessageRequestPayload](interfaces/messagerequestpayload.md) |
`client` | Client |

**Returns:** *void*

___

###  handleRequest

▸ **handleRequest**(`request`: string, `method`: [MethodNames](README.md#methodnames), `options`: RequestOptions, `context`: [MessageContext](interfaces/messagecontext.md), `client`: Client): *Promise‹void›*

*Defined in [register-worker/index.ts:12](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/worker-client/src/register-worker/index.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`request` | string |
`method` | [MethodNames](README.md#methodnames) |
`options` | RequestOptions |
`context` | [MessageContext](interfaces/messagecontext.md) |
`client` | Client |

**Returns:** *Promise‹void›*

___

###  handleSubscription

▸ **handleSubscription**(`request`: string, `method`: [MethodNames](README.md#methodnames), `options`: RequestOptions, `context`: [MessageContext](interfaces/messagecontext.md), `client`: Client): *Promise‹void›*

*Defined in [register-worker/index.ts:44](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/worker-client/src/register-worker/index.ts#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`request` | string |
`method` | [MethodNames](README.md#methodnames) |
`options` | RequestOptions |
`context` | [MessageContext](interfaces/messagecontext.md) |
`client` | Client |

**Returns:** *Promise‹void›*

___

###  logRequest

▸ **logRequest**(): *(Anonymous function)*

*Defined in [debug/log-request/index.ts:4](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/worker-client/src/debug/log-request/index.ts#L4)*

**Returns:** *(Anonymous function)*

___

###  logSubscription

▸ **logSubscription**(): *(Anonymous function)*

*Defined in [debug/log-subscription/index.ts:3](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/worker-client/src/debug/log-subscription/index.ts#L3)*

**Returns:** *(Anonymous function)*

___

###  registerWorker

▸ **registerWorker**(`__namedParameters`: object): *Promise‹void›*

*Defined in [register-worker/index.ts:79](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/worker-client/src/register-worker/index.ts#L79)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`client` | Client‹› |

**Returns:** *Promise‹void›*
