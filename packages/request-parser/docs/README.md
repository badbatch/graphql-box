
#  Documentation

## Index

### Classes

* [RequestParser](classes/requestparser.md)

### Interfaces

* [ClientOptions](interfaces/clientoptions.md)
* [ConstructorOptions](interfaces/constructoroptions.md)
* [FragmentDefinitionNodeMap](interfaces/fragmentdefinitionnodemap.md)
* [InitOptions](interfaces/initoptions.md)
* [MapFieldToTypeData](interfaces/mapfieldtotypedata.md)
* [RequestParserDef](interfaces/requestparserdef.md)
* [UpdateRequestResult](interfaces/updaterequestresult.md)
* [UserOptions](interfaces/useroptions.md)
* [VariableTypesMap](interfaces/variabletypesmap.md)

### Type aliases

* [RequestParserInit](#requestparserinit)

### Functions

* [init](#init)

---

## Type aliases

<a id="requestparserinit"></a>

###  RequestParserInit

**Ƭ RequestParserInit**: *`function`*

*Defined in [defs/index.ts:60](https://github.com/bad-batch/handl/blob/20503ed/packages/request-parser/src/defs/index.ts#L60)*

#### Type declaration
▸(options: *[ClientOptions](interfaces/clientoptions.md)*): `Promise`<[RequestParserDef](interfaces/requestparserdef.md)>

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [ClientOptions](interfaces/clientoptions.md) |

**Returns:** `Promise`<[RequestParserDef](interfaces/requestparserdef.md)>

___

## Functions

<a id="init"></a>

###  init

▸ **init**(userOptions: *[UserOptions](interfaces/useroptions.md)*): [RequestParserInit](#requestparserinit)

*Defined in [main/index.ts:500](https://github.com/bad-batch/handl/blob/20503ed/packages/request-parser/src/main/index.ts#L500)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| userOptions | [UserOptions](interfaces/useroptions.md) |

**Returns:** [RequestParserInit](#requestparserinit)

___

