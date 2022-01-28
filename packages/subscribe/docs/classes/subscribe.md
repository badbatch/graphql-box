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

*Defined in [packages/subscribe/src/main/index.ts:37](https://github.com/badbatch/graphql-box/blob/f8ef82d/packages/subscribe/src/main/index.ts#L37)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[Subscribe](subscribe.md)*

## Methods

###  subscribe

▸ **subscribe**(`__namedParameters`: object, `options`: ServerRequestOptions, `__namedParameters`: object, `subscriberResolver`: SubscriberResolver): *Promise‹AsyncIterator‹MaybeRequestResult | undefined››*

*Defined in [packages/subscribe/src/main/index.ts:49](https://github.com/badbatch/graphql-box/blob/f8ef82d/packages/subscribe/src/main/index.ts#L49)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`ast` | undefined &#124; DocumentNode |
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

*Defined in [packages/subscribe/src/main/index.ts:19](https://github.com/badbatch/graphql-box/blob/f8ef82d/packages/subscribe/src/main/index.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../README.md#initoptions) |

**Returns:** *Promise‹[Subscribe](subscribe.md)›*
