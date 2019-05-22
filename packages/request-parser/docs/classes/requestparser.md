[Documentation](../README.md) > [RequestParser](../classes/requestparser.md)

# Class: RequestParser

## Hierarchy

**RequestParser**

## Implements

* [RequestParserDef](../interfaces/requestparserdef.md)

## Index

### Constructors

* [constructor](requestparser.md#constructor)

### Methods

* [updateRequest](requestparser.md#updaterequest)
* [init](requestparser.md#init)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new RequestParser**(options: *[ConstructorOptions](../interfaces/constructoroptions.md)*): [RequestParser](requestparser.md)

*Defined in [main/index.ts:246](https://github.com/bad-batch/handl/blob/20503ed/packages/request-parser/src/main/index.ts#L246)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** [RequestParser](requestparser.md)

___

## Methods

<a id="updaterequest"></a>

###  updateRequest

▸ **updateRequest**(request: *`string`*, options: *`RequestOptions`*, context: *`RequestContext`*): `Promise`<[UpdateRequestResult](../interfaces/updaterequestresult.md)>

*Implementation of [RequestParserDef](../interfaces/requestparserdef.md).[updateRequest](../interfaces/requestparserdef.md#updaterequest)*

*Defined in [main/index.ts:254](https://github.com/bad-batch/handl/blob/20503ed/packages/request-parser/src/main/index.ts#L254)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `string` |
| options | `RequestOptions` |
| context | `RequestContext` |

**Returns:** `Promise`<[UpdateRequestResult](../interfaces/updaterequestresult.md)>

___
<a id="init"></a>

### `<Static>` init

▸ **init**(options: *[InitOptions](../interfaces/initoptions.md)*): `Promise`<[RequestParser](requestparser.md)>

*Defined in [main/index.ts:71](https://github.com/bad-batch/handl/blob/20503ed/packages/request-parser/src/main/index.ts#L71)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [InitOptions](../interfaces/initoptions.md) |

**Returns:** `Promise`<[RequestParser](requestparser.md)>

___

