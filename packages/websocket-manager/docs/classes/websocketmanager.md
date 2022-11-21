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

\+ **new WebsocketManager**(`options`: [UserOptions](../interfaces/useroptions.md)): *[WebsocketManager](websocketmanager.md)*

*Defined in [main/index.ts:20](https://github.com/badbatch/graphql-box/blob/e966cb9b/packages/websocket-manager/src/main/index.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *[WebsocketManager](websocketmanager.md)*

## Methods

###  subscribe

▸ **subscribe**(`__namedParameters`: object, `_options`: RequestOptions, `context`: RequestContext, `subscriberResolver`: SubscriberResolver): *Promise‹AsyncIterator‹MaybeRequestResult | undefined››*

*Defined in [main/index.ts:38](https://github.com/badbatch/graphql-box/blob/e966cb9b/packages/websocket-manager/src/main/index.ts#L38)*

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
