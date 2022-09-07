[Documentation](../README.md) › [Subscribe](subscribe.md)

# Class: Subscribe

## Hierarchy

* **Subscribe**

## Index

### Constructors

* [constructor](subscribe.md#constructor)

### Methods

* [subscribe](subscribe.md#subscribe)

## Constructors

###  constructor

\+ **new Subscribe**(`options`: [ConstructorOptions](../README.md#constructoroptions)): *[Subscribe](subscribe.md)*

*Defined in [main/index.ts:26](https://github.com/badbatch/graphql-box/blob/f07703b6/packages/subscribe/src/main/index.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[Subscribe](subscribe.md)*

## Methods

###  subscribe

▸ **subscribe**(`__namedParameters`: object, `options`: ServerRequestOptions, `context`: RequestContext, `subscriberResolver`: SubscriberResolver): *Promise‹AsyncIterator‹MaybeRequestResult | undefined››*

*Defined in [main/index.ts:48](https://github.com/badbatch/graphql-box/blob/f07703b6/packages/subscribe/src/main/index.ts#L48)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`ast` | any |
`hash` | string |

▪ **options**: *ServerRequestOptions*

▪ **context**: *RequestContext*

▪ **subscriberResolver**: *SubscriberResolver*

**Returns:** *Promise‹AsyncIterator‹MaybeRequestResult | undefined››*
