> **[Documentation](../README.md)**

[WebsocketManager](websocketmanager.md) /

# Class: WebsocketManager

## Hierarchy

* **WebsocketManager**

## Implements

* `SubscriptionsManagerDef`

## Index

### Constructors

* [constructor](websocketmanager.md#constructor)

### Methods

* [subscribe](websocketmanager.md#subscribe)
* [init](websocketmanager.md#static-init)

## Constructors

###  constructor

\+ **new WebsocketManager**(`options`: [ConstructorOptions](../README.md#constructoroptions)): *[WebsocketManager](websocketmanager.md)*

*Defined in [main/index.ts:39](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/websocket-manager/src/main/index.ts#L39)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[WebsocketManager](websocketmanager.md)*

## Methods

###  subscribe

▸ **subscribe**(`__namedParameters`: object, `options`: `RequestOptions`, `context`: `RequestContext`, `subscriberResolver`: `SubscriberResolver`): *`Promise<AsyncIterator<MaybeRequestResult | undefined>>`*

*Defined in [main/index.ts:47](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/websocket-manager/src/main/index.ts#L47)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`hash` | string |
`request` | string |

▪ **options**: *`RequestOptions`*

▪ **context**: *`RequestContext`*

▪ **subscriberResolver**: *`SubscriberResolver`*

**Returns:** *`Promise<AsyncIterator<MaybeRequestResult | undefined>>`*

___

### `Static` init

▸ **init**(`options`: [InitOptions](../README.md#initoptions)): *`Promise<WebsocketManager>`*

*Defined in [main/index.ts:21](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/websocket-manager/src/main/index.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../README.md#initoptions) |

**Returns:** *`Promise<WebsocketManager>`*