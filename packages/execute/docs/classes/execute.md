[Documentation](../README.md) > [Execute](../classes/execute.md)

# Class: Execute

## Hierarchy

**Execute**

## Implements

* `RequestManagerDef`

## Index

### Constructors

* [constructor](execute.md#constructor)

### Methods

* [execute](execute.md#execute-1)
* [init](execute.md#init)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Execute**(options: *[ConstructorOptions](../#constructoroptions)*): [Execute](execute.md)

*Defined in [main/index.ts:36](https://github.com/bad-batch/handl/blob/20503ed/packages/execute/src/main/index.ts#L36)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [ConstructorOptions](../#constructoroptions) |

**Returns:** [Execute](execute.md)

___

## Methods

<a id="execute-1"></a>

###  execute

▸ **execute**(__namedParameters: *`object`*, options: *`ServerRequestOptions`*, __namedParameters: *`object`*): `Promise`<`MaybeRawResponseData`>

*Defined in [main/index.ts:46](https://github.com/bad-batch/handl/blob/20503ed/packages/execute/src/main/index.ts#L46)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| ast | `undefined` \| `DocumentNode` |
| request | `string` |

**options: `ServerRequestOptions`**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| handlID | `string` |

**Returns:** `Promise`<`MaybeRawResponseData`>

___
<a id="init"></a>

### `<Static>` init

▸ **init**(options: *[InitOptions](../#initoptions)*): `Promise`<[Execute](execute.md)>

*Defined in [main/index.ts:21](https://github.com/bad-batch/handl/blob/20503ed/packages/execute/src/main/index.ts#L21)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [InitOptions](../#initoptions) |

**Returns:** `Promise`<[Execute](execute.md)>

___

