> **[Documentation](README.md)**

## Index

### Classes

* [WorkerClient](classes/workerclient.md)

### Interfaces

* [ConstructorOptions](interfaces/constructoroptions.md)
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
* [REQUEST_EXECUTED](README.md#const-request_executed)
* [SUBSCRIBE](README.md#const-subscribe)
* [addEventListener](README.md#addeventlistener)
* [postMessage](README.md#postmessage)

### Functions

* [handleMessage](README.md#handlemessage)
* [handleRequest](README.md#handlerequest)
* [handleSubscription](README.md#handlesubscription)
* [logRequest](README.md#logrequest)
* [registerWorker](README.md#registerworker)

## Type aliases

###  MethodNames

Ƭ **MethodNames**: *"request" | "subscribe"*

*Defined in [defs/index.ts:34](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/worker-client/src/defs/index.ts#L34)*

___

###  PendingResolver

Ƭ **PendingResolver**: *function*

*Defined in [defs/index.ts:36](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/worker-client/src/defs/index.ts#L36)*

#### Type declaration:

▸ (`value`: `MaybeRequestResult`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | `MaybeRequestResult` |

___

###  PendingTracker

Ƭ **PendingTracker**: *`Map<string, PendingData>`*

*Defined in [defs/index.ts:42](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/worker-client/src/defs/index.ts#L42)*

## Variables

### `Const` CACHEMAP

• **CACHEMAP**: *"cachemap"* = "cachemap"

*Defined in [consts/index.ts:9](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/worker-client/src/consts/index.ts#L9)*

___

### `Const` GRAPHQL_BOX

• **GRAPHQL_BOX**: *"graphqlBox"* = "graphqlBox"

*Defined in [consts/index.ts:8](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/worker-client/src/consts/index.ts#L8)*

___

### `Const` MESSAGE

• **MESSAGE**: *"message"* = "message"

*Defined in [consts/index.ts:6](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/worker-client/src/consts/index.ts#L6)*

___

### `Const` REQUEST

• **REQUEST**: *"request"* = "request"

*Defined in [consts/index.ts:3](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/worker-client/src/consts/index.ts#L3)*

___

### `Const` REQUEST_EXECUTED

• **REQUEST_EXECUTED**: *"request_executed"* = "request_executed"

*Defined in [consts/index.ts:1](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/worker-client/src/consts/index.ts#L1)*

___

### `Const` SUBSCRIBE

• **SUBSCRIBE**: *"subscribe"* = "subscribe"

*Defined in [consts/index.ts:4](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/worker-client/src/consts/index.ts#L4)*

___

###  addEventListener

• **addEventListener**: *`addEventListener`*

*Defined in [register-worker/index.ts:19](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/worker-client/src/register-worker/index.ts#L19)*

___

###  postMessage

• **postMessage**: *`postMessage`*

*Defined in [register-worker/index.ts:19](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/worker-client/src/register-worker/index.ts#L19)*

## Functions

###  handleMessage

▸ **handleMessage**(`data`: [MessageRequestPayload](interfaces/messagerequestpayload.md), `client`: `Client`): *void*

*Defined in [register-worker/index.ts:52](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/worker-client/src/register-worker/index.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | [MessageRequestPayload](interfaces/messagerequestpayload.md) |
`client` | `Client` |

**Returns:** *void*

___

###  handleRequest

▸ **handleRequest**(`request`: string, `method`: [MethodNames](README.md#methodnames), `options`: `RequestOptions`, `context`: [MessageContext](interfaces/messagecontext.md), `client`: `Client`): *`Promise<void>`*

*Defined in [register-worker/index.ts:21](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/worker-client/src/register-worker/index.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`request` | string |
`method` | [MethodNames](README.md#methodnames) |
`options` | `RequestOptions` |
`context` | [MessageContext](interfaces/messagecontext.md) |
`client` | `Client` |

**Returns:** *`Promise<void>`*

___

###  handleSubscription

▸ **handleSubscription**(`request`: string, `method`: [MethodNames](README.md#methodnames), `options`: `RequestOptions`, `context`: [MessageContext](interfaces/messagecontext.md), `client`: `Client`): *`Promise<void>`*

*Defined in [register-worker/index.ts:34](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/worker-client/src/register-worker/index.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`request` | string |
`method` | [MethodNames](README.md#methodnames) |
`options` | `RequestOptions` |
`context` | [MessageContext](interfaces/messagecontext.md) |
`client` | `Client` |

**Returns:** *`Promise<void>`*

___

###  logRequest

▸ **logRequest**(): *`(Anonymous function)`*

*Defined in [debug/log-request/index.ts:4](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/worker-client/src/debug/log-request/index.ts#L4)*

**Returns:** *`(Anonymous function)`*

___

###  registerWorker

▸ **registerWorker**(`__namedParameters`: object): *`Promise<void>`*

*Defined in [register-worker/index.ts:62](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/worker-client/src/register-worker/index.ts#L62)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`client` | `Client` |

**Returns:** *`Promise<void>`*