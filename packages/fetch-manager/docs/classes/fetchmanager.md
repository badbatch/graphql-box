[Documentation](../README.md) > [FetchManager](../classes/fetchmanager.md)

# Class: FetchManager

## Hierarchy

**FetchManager**

## Implements

* `RequestManagerDef`

## Index

### Constructors

* [constructor](fetchmanager.md#constructor)

### Methods

* [execute](fetchmanager.md#execute)
* [init](fetchmanager.md#init)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new FetchManager**(options: *[ConstructorOptions](../#constructoroptions)*): [FetchManager](fetchmanager.md)

*Defined in [main/index.ts:71](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/main/index.ts#L71)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [ConstructorOptions](../#constructoroptions) |

**Returns:** [FetchManager](fetchmanager.md)

___

## Methods

<a id="execute"></a>

###  execute

▸ **execute**(__namedParameters: *`object`*, options: *`RequestOptions`*, context: *`RequestContext`*): `Promise`<`MaybeRawResponseData`>

*Defined in [main/index.ts:83](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/main/index.ts#L83)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| hash | `string` |
| request | `string` |

**options: `RequestOptions`**

**context: `RequestContext`**

**Returns:** `Promise`<`MaybeRawResponseData`>

___
<a id="init"></a>

### `<Static>` init

▸ **init**(options: *[InitOptions](../#initoptions)*): `Promise`<[FetchManager](fetchmanager.md)>

*Defined in [main/index.ts:26](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/main/index.ts#L26)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [InitOptions](../#initoptions) |

**Returns:** `Promise`<[FetchManager](fetchmanager.md)>

___

