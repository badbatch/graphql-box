[Documentation](README.md)

# Documentation

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

* [RequestParserInit](README.md#requestparserinit)

### Functions

* [init](README.md#init)

## Type aliases

###  RequestParserInit

Ƭ **RequestParserInit**: *function*

*Defined in [defs/index.ts:56](https://github.com/badbatch/graphql-box/blob/cfaf258/packages/request-parser/src/defs/index.ts#L56)*

#### Type declaration:

▸ (`options`: [ClientOptions](interfaces/clientoptions.md)): *Promise‹[RequestParserDef](interfaces/requestparserdef.md)›*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ClientOptions](interfaces/clientoptions.md) |

## Functions

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *[RequestParserInit](README.md#requestparserinit)*

*Defined in [main/index.ts:501](https://github.com/badbatch/graphql-box/blob/cfaf258/packages/request-parser/src/main/index.ts#L501)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *[RequestParserInit](README.md#requestparserinit)*
