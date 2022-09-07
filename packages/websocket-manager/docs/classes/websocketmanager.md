[Documentation](../README.md) › [WebsocketManager](websocketmanager.md)

# Class: WebsocketManager

## Hierarchy

* **WebsocketManager**

## Implements

* SubscriptionsManagerDef

## Index

### Constructors

* [constructor](websocketmanager.md#constructor)

### Methods

* [subscribe](websocketmanager.md#subscribe)

## Constructors

###  constructor

\+ **new WebsocketManager**(`options`: [ConstructorOptions](../README.md#constructoroptions)): *[WebsocketManager](websocketmanager.md)*

*Defined in [main/index.ts:22](https://github.com/badbatch/graphql-box/blob/e26041be/packages/websocket-manager/src/main/index.ts#L22)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[WebsocketManager](websocketmanager.md)*

## Methods

###  subscribe

▸ **subscribe**(`__namedParameters`: object, `_options`: RequestOptions, `context`: RequestContext, `subscriberResolver`: SubscriberResolver): *Promise‹AsyncIterator‹MaybeRequestResult | undefined››*

*Defined in [main/index.ts:40](https://github.com/badbatch/graphql-box/blob/e26041be/packages/websocket-manager/src/main/index.ts#L40)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`hash` | string |
`request` | string |

▪ **_options**: *RequestOptions*

▪ **context**: *RequestContext*

▪ **subscriberResolver**: *SubscriberResolver*

**Returns:** *Promise‹AsyncIterator‹MaybeRequestResult | undefined››*
