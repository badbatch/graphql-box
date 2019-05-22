[Documentation](../README.md) > [Subscribe](../classes/subscribe.md)

# Class: Subscribe

## Hierarchy

**Subscribe**

## Index

### Constructors

* [constructor](subscribe.md#constructor)

### Methods

* [subscribe](subscribe.md#subscribe-1)
* [init](subscribe.md#init)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Subscribe**(options: *[ConstructorOptions](../#constructoroptions)*): [Subscribe](subscribe.md)

*Defined in [main/index.ts:41](https://github.com/bad-batch/handl/blob/20503ed/packages/subscribe/src/main/index.ts#L41)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [ConstructorOptions](../#constructoroptions) |

**Returns:** [Subscribe](subscribe.md)

___

## Methods

<a id="subscribe-1"></a>

###  subscribe

▸ **subscribe**(__namedParameters: *`object`*, options: *`ServerRequestOptions`*, __namedParameters: *`object`*, subscriberResolver: *`SubscriberResolver`*): `Promise`<`AsyncIterator`<`MaybeRequestResult` \| `undefined`>>

*Defined in [main/index.ts:52](https://github.com/bad-batch/handl/blob/20503ed/packages/subscribe/src/main/index.ts#L52)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| ast | `undefined` \| `DocumentNode` |
| hash | `string` |
| request | `string` |

**options: `ServerRequestOptions`**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| handlID | `string` |

**subscriberResolver: `SubscriberResolver`**

**Returns:** `Promise`<`AsyncIterator`<`MaybeRequestResult` \| `undefined`>>

___
<a id="init"></a>

### `<Static>` init

▸ **init**(options: *[InitOptions](../#initoptions)*): `Promise`<[Subscribe](subscribe.md)>

*Defined in [main/index.ts:24](https://github.com/bad-batch/handl/blob/20503ed/packages/subscribe/src/main/index.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [InitOptions](../#initoptions) |

**Returns:** `Promise`<[Subscribe](subscribe.md)>

___

