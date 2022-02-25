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
* [init](websocketmanager.md#static-init)

## Constructors

###  constructor

\+ **new WebsocketManager**(`options`: [ConstructorOptions](../README.md#constructoroptions)): *[WebsocketManager](websocketmanager.md)*

*Defined in [main/index.ts:35](https://github.com/badbatch/graphql-box/blob/35d1f39/packages/websocket-manager/src/main/index.ts#L35)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[WebsocketManager](websocketmanager.md)*

## Methods

###  subscribe

▸ **subscribe**(`__namedParameters`: object, `_options`: RequestOptions, `context`: RequestContext, `subscriberResolver`: SubscriberResolver): *Promise‹AsyncIterator‹MaybeRequestResult | undefined››*

*Defined in [main/index.ts:43](https://github.com/badbatch/graphql-box/blob/35d1f39/packages/websocket-manager/src/main/index.ts#L43)*

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

___

### `Static` init

▸ **init**(`options`: [InitOptions](../README.md#initoptions)): *Promise‹[WebsocketManager](websocketmanager.md)›*

*Defined in [main/index.ts:17](https://github.com/badbatch/graphql-box/blob/35d1f39/packages/websocket-manager/src/main/index.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../README.md#initoptions) |

**Returns:** *Promise‹[WebsocketManager](websocketmanager.md)›*
