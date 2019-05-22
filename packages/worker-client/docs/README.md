
#  Documentation

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

* [MethodNames](#methodnames)
* [PendingResolver](#pendingresolver)
* [PendingTracker](#pendingtracker)

### Variables

* [CACHEMAP](#cachemap)
* [HANDL](#handl)
* [MESSAGE](#message)
* [REQUEST](#request)
* [REQUEST_EXECUTED](#request_executed)
* [SUBSCRIBE](#subscribe)
* [addEventListener](#addeventlistener)
* [postMessage](#postmessage)

### Functions

* [handleMessage](#handlemessage)
* [handleRequest](#handlerequest)
* [handleSubscription](#handlesubscription)
* [logRequest](#logrequest)
* [registerWorker](#registerworker)

---

## Type aliases

<a id="methodnames"></a>

###  MethodNames

**Ƭ MethodNames**: *"request" \| "subscribe"*

*Defined in [defs/index.ts:34](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/defs/index.ts#L34)*

___
<a id="pendingresolver"></a>

###  PendingResolver

**Ƭ PendingResolver**: *`function`*

*Defined in [defs/index.ts:36](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/defs/index.ts#L36)*

#### Type declaration
▸(value: *`MaybeRequestResult`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `MaybeRequestResult` |

**Returns:** `void`

___
<a id="pendingtracker"></a>

###  PendingTracker

**Ƭ PendingTracker**: *`Map`<`string`, [PendingData](interfaces/pendingdata.md)>*

*Defined in [defs/index.ts:42](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/defs/index.ts#L42)*

___

## Variables

<a id="cachemap"></a>

### `<Const>` CACHEMAP

**● CACHEMAP**: *"cachemap"* = "cachemap"

*Defined in [consts/index.ts:9](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/consts/index.ts#L9)*

___
<a id="handl"></a>

### `<Const>` HANDL

**● HANDL**: *"handl"* = "handl"

*Defined in [consts/index.ts:8](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/consts/index.ts#L8)*

___
<a id="message"></a>

### `<Const>` MESSAGE

**● MESSAGE**: *"message"* = "message"

*Defined in [consts/index.ts:6](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/consts/index.ts#L6)*

___
<a id="request"></a>

### `<Const>` REQUEST

**● REQUEST**: *"request"* = "request"

*Defined in [consts/index.ts:3](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/consts/index.ts#L3)*

___
<a id="request_executed"></a>

### `<Const>` REQUEST_EXECUTED

**● REQUEST_EXECUTED**: *"request_executed"* = "request_executed"

*Defined in [consts/index.ts:1](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/consts/index.ts#L1)*

___
<a id="subscribe"></a>

### `<Const>` SUBSCRIBE

**● SUBSCRIBE**: *"subscribe"* = "subscribe"

*Defined in [consts/index.ts:4](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/consts/index.ts#L4)*

___
<a id="addeventlistener"></a>

###  addEventListener

**● addEventListener**: *`addEventListener`*

*Defined in [register-worker/index.ts:19](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/register-worker/index.ts#L19)*

___
<a id="postmessage"></a>

###  postMessage

**● postMessage**: *`postMessage`*

*Defined in [register-worker/index.ts:19](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/register-worker/index.ts#L19)*

___

## Functions

<a id="handlemessage"></a>

###  handleMessage

▸ **handleMessage**(data: *[MessageRequestPayload](interfaces/messagerequestpayload.md)*, client: *`Client`*): `void`

*Defined in [register-worker/index.ts:52](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/register-worker/index.ts#L52)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | [MessageRequestPayload](interfaces/messagerequestpayload.md) |
| client | `Client` |

**Returns:** `void`

___
<a id="handlerequest"></a>

###  handleRequest

▸ **handleRequest**(request: *`string`*, method: *[MethodNames](#methodnames)*, options: *`RequestOptions`*, context: *[MessageContext](interfaces/messagecontext.md)*, client: *`Client`*): `Promise`<`void`>

*Defined in [register-worker/index.ts:21](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/register-worker/index.ts#L21)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `string` |
| method | [MethodNames](#methodnames) |
| options | `RequestOptions` |
| context | [MessageContext](interfaces/messagecontext.md) |
| client | `Client` |

**Returns:** `Promise`<`void`>

___
<a id="handlesubscription"></a>

###  handleSubscription

▸ **handleSubscription**(request: *`string`*, method: *[MethodNames](#methodnames)*, options: *`RequestOptions`*, context: *[MessageContext](interfaces/messagecontext.md)*, client: *`Client`*): `Promise`<`void`>

*Defined in [register-worker/index.ts:34](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/register-worker/index.ts#L34)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `string` |
| method | [MethodNames](#methodnames) |
| options | `RequestOptions` |
| context | [MessageContext](interfaces/messagecontext.md) |
| client | `Client` |

**Returns:** `Promise`<`void`>

___
<a id="logrequest"></a>

###  logRequest

▸ **logRequest**(): `(Anonymous function)`

*Defined in [debug/log-request/index.ts:4](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/debug/log-request/index.ts#L4)*

**Returns:** `(Anonymous function)`

___
<a id="registerworker"></a>

###  registerWorker

▸ **registerWorker**(__namedParameters: *`object`*): `Promise`<`void`>

*Defined in [register-worker/index.ts:62](https://github.com/bad-batch/handl/blob/20503ed/packages/worker-client/src/register-worker/index.ts#L62)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| client | `Client` |

**Returns:** `Promise`<`void`>

___

