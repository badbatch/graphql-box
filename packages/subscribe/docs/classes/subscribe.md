[Documentation](../README.md) › [Subscribe](subscribe.md)

# Class: Subscribe

## Hierarchy

* **Subscribe**

## Index

### Constructors

* [constructor](subscribe.md#constructor)

### Methods

* [subscribe](subscribe.md#subscribe)
* [init](subscribe.md#static-init)

## Constructors

###  constructor

\+ **new Subscribe**(`options`: [ConstructorOptions](../README.md#constructoroptions)): *[Subscribe](subscribe.md)*

*Defined in [main/index.ts:36](https://github.com/badbatch/graphql-box/blob/27a200e/packages/subscribe/src/main/index.ts#L36)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[Subscribe](subscribe.md)*

## Methods

###  subscribe

▸ **subscribe**(`__namedParameters`: object, `options`: ServerRequestOptions, `__namedParameters`: object, `subscriberResolver`: SubscriberResolver): *Promise‹AsyncIterator‹MaybeRequestResult | undefined››*

*Defined in [main/index.ts:48](https://github.com/badbatch/graphql-box/blob/27a200e/packages/subscribe/src/main/index.ts#L48)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`ast` | any |
`hash` | string |
`request` | string |

▪ **options**: *ServerRequestOptions*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`boxID` | string |

▪ **subscriberResolver**: *SubscriberResolver*

**Returns:** *Promise‹AsyncIterator‹MaybeRequestResult | undefined››*

___

### `Static` init

▸ **init**(`options`: [InitOptions](../README.md#initoptions)): *Promise‹[Subscribe](subscribe.md)›*

*Defined in [main/index.ts:18](https://github.com/badbatch/graphql-box/blob/27a200e/packages/subscribe/src/main/index.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../README.md#initoptions) |

**Returns:** *Promise‹[Subscribe](subscribe.md)›*
