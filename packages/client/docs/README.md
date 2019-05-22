
#  Documentation

## Index

### Classes

* [Client](classes/client.md)

### Interfaces

* [ConstructorOptions](interfaces/constructoroptions.md)
* [PendingQueryData](interfaces/pendingquerydata.md)
* [QueryTracker](interfaces/querytracker.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [PendingQueryResolver](#pendingqueryresolver)

### Variables

* [REQUEST_EXECUTED](#request_executed)
* [SUBSCRIPTION_EXECUTED](#subscription_executed)

### Functions

* [logRequest](#logrequest)
* [logSubscription](#logsubscription)

---

## Type aliases

<a id="pendingqueryresolver"></a>

###  PendingQueryResolver

**Ƭ PendingQueryResolver**: *`function`*

*Defined in [defs/index.ts:75](https://github.com/bad-batch/handl/blob/20503ed/packages/client/src/defs/index.ts#L75)*

#### Type declaration
▸(value: *`MaybeRequestResult`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `MaybeRequestResult` |

**Returns:** `void`

___

## Variables

<a id="request_executed"></a>

### `<Const>` REQUEST_EXECUTED

**● REQUEST_EXECUTED**: *"request_executed"* = "request_executed"

*Defined in [consts/index.ts:1](https://github.com/bad-batch/handl/blob/20503ed/packages/client/src/consts/index.ts#L1)*

___
<a id="subscription_executed"></a>

### `<Const>` SUBSCRIPTION_EXECUTED

**● SUBSCRIPTION_EXECUTED**: *"subscription_executed"* = "subscription_executed"

*Defined in [consts/index.ts:2](https://github.com/bad-batch/handl/blob/20503ed/packages/client/src/consts/index.ts#L2)*

___

## Functions

<a id="logrequest"></a>

###  logRequest

▸ **logRequest**(): `(Anonymous function)`

*Defined in [debug/log-request/index.ts:4](https://github.com/bad-batch/handl/blob/20503ed/packages/client/src/debug/log-request/index.ts#L4)*

**Returns:** `(Anonymous function)`

___
<a id="logsubscription"></a>

###  logSubscription

▸ **logSubscription**(): `(Anonymous function)`

*Defined in [debug/log-subscription/index.ts:4](https://github.com/bad-batch/handl/blob/20503ed/packages/client/src/debug/log-subscription/index.ts#L4)*

**Returns:** `(Anonymous function)`

___

