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

\+ **new Subscribe**(`options`: [UserOptions](../interfaces/useroptions.md)): *[Subscribe](subscribe.md)*

*Defined in [main/index.ts:25](https://github.com/badbatch/graphql-box/blob/870b4903/packages/subscribe/src/main/index.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *[Subscribe](subscribe.md)*

## Methods

###  subscribe

▸ **subscribe**(`__namedParameters`: object, `options`: ServerRequestOptions, `context`: RequestContext, `subscriberResolver`: SubscriberResolver): *Promise‹AsyncIterator‹MaybeRequestResult | undefined››*

*Defined in [main/index.ts:47](https://github.com/badbatch/graphql-box/blob/870b4903/packages/subscribe/src/main/index.ts#L47)*

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
