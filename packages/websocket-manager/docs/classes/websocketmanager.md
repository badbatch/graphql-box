[Documentation](../README.md) > [WebsocketManager](../classes/websocketmanager.md)

# Class: WebsocketManager

## Hierarchy

**WebsocketManager**

## Implements

* `SubscriptionsManagerDef`

## Index

### Constructors

* [constructor](websocketmanager.md#constructor)

### Methods

* [subscribe](websocketmanager.md#subscribe)
* [init](websocketmanager.md#init)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new WebsocketManager**(options: *[ConstructorOptions](../#constructoroptions)*): [WebsocketManager](websocketmanager.md)

*Defined in [main/index.ts:39](https://github.com/bad-batch/handl/blob/20503ed/packages/websocket-manager/src/main/index.ts#L39)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [ConstructorOptions](../#constructoroptions) |

**Returns:** [WebsocketManager](websocketmanager.md)

___

## Methods

<a id="subscribe"></a>

###  subscribe

▸ **subscribe**(__namedParameters: *`object`*, options: *`RequestOptions`*, context: *`RequestContext`*, subscriberResolver: *`SubscriberResolver`*): `Promise`<`AsyncIterator`<`MaybeRequestResult` \| `undefined`>>

*Defined in [main/index.ts:47](https://github.com/bad-batch/handl/blob/20503ed/packages/websocket-manager/src/main/index.ts#L47)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| hash | `string` |
| request | `string` |

**options: `RequestOptions`**

**context: `RequestContext`**

**subscriberResolver: `SubscriberResolver`**

**Returns:** `Promise`<`AsyncIterator`<`MaybeRequestResult` \| `undefined`>>

___
<a id="init"></a>

### `<Static>` init

▸ **init**(options: *[InitOptions](../#initoptions)*): `Promise`<[WebsocketManager](websocketmanager.md)>

*Defined in [main/index.ts:21](https://github.com/bad-batch/handl/blob/20503ed/packages/websocket-manager/src/main/index.ts#L21)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [InitOptions](../#initoptions) |

**Returns:** `Promise`<[WebsocketManager](websocketmanager.md)>

___

