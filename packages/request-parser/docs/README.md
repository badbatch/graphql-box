[Documentation](README.md)

# Documentation

## Index

### Classes

* [RequestParser](classes/requestparser.md)

### Interfaces

* [Ancestors](interfaces/ancestors.md)
* [ClientOptions](interfaces/clientoptions.md)
* [ConstructorOptions](interfaces/constructoroptions.md)
* [InitOptions](interfaces/initoptions.md)
* [MapFieldToTypeData](interfaces/mapfieldtotypedata.md)
* [RequestParserDef](interfaces/requestparserdef.md)
* [UpdateRequestResult](interfaces/updaterequestresult.md)
* [UserOptions](interfaces/useroptions.md)
* [VisitorContext](interfaces/visitorcontext.md)

### Type aliases

* [PersistedFragmentSpread](README.md#persistedfragmentspread)
* [RequestParserInit](README.md#requestparserinit)

### Functions

* [init](README.md#init)

## Type aliases

###  PersistedFragmentSpread

Ƭ **PersistedFragmentSpread**: *[string, ParsedDirective[], ReadonlyArray‹any›]*

*Defined in [defs/index.ts:63](https://github.com/badbatch/graphql-box/blob/1dcbc7d/packages/request-parser/src/defs/index.ts#L63)*

___

###  RequestParserInit

Ƭ **RequestParserInit**: *function*

*Defined in [defs/index.ts:41](https://github.com/badbatch/graphql-box/blob/1dcbc7d/packages/request-parser/src/defs/index.ts#L41)*

#### Type declaration:

▸ (`options`: [ClientOptions](interfaces/clientoptions.md)): *Promise‹[RequestParserDef](interfaces/requestparserdef.md)›*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ClientOptions](interfaces/clientoptions.md) |

## Functions

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *[RequestParserInit](README.md#requestparserinit)*

*Defined in [main/index.ts:545](https://github.com/badbatch/graphql-box/blob/1dcbc7d/packages/request-parser/src/main/index.ts#L545)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *[RequestParserInit](README.md#requestparserinit)*
