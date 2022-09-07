[Documentation](README.md)

# Documentation

## Index

### Classes

* [RequestParser](classes/requestparser.md)

### Interfaces

* [Ancestors](interfaces/ancestors.md)
* [ClientOptions](interfaces/clientoptions.md)
* [MapFieldToTypeData](interfaces/mapfieldtotypedata.md)
* [RequestParserDef](interfaces/requestparserdef.md)
* [UpdateRequestResult](interfaces/updaterequestresult.md)
* [UserOptions](interfaces/useroptions.md)
* [VisitorContext](interfaces/visitorcontext.md)

### Type aliases

* [ConstructorOptions](README.md#constructoroptions)
* [PersistedFragmentSpread](README.md#persistedfragmentspread)
* [RequestParserInit](README.md#requestparserinit)

### Functions

* [init](README.md#init)

## Type aliases

###  ConstructorOptions

Ƭ **ConstructorOptions**: *[UserOptions](interfaces/useroptions.md) & [ClientOptions](interfaces/clientoptions.md)*

*Defined in [defs/index.ts:36](https://github.com/badbatch/graphql-box/blob/e26041be/packages/request-parser/src/defs/index.ts#L36)*

___

###  PersistedFragmentSpread

Ƭ **PersistedFragmentSpread**: *[string, ParsedDirective[], ReadonlyArray‹any›]*

*Defined in [defs/index.ts:69](https://github.com/badbatch/graphql-box/blob/e26041be/packages/request-parser/src/defs/index.ts#L69)*

___

###  RequestParserInit

Ƭ **RequestParserInit**: *function*

*Defined in [defs/index.ts:47](https://github.com/badbatch/graphql-box/blob/e26041be/packages/request-parser/src/defs/index.ts#L47)*

#### Type declaration:

▸ (`options`: [ClientOptions](interfaces/clientoptions.md)): *[RequestParserDef](interfaces/requestparserdef.md)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ClientOptions](interfaces/clientoptions.md) |

## Functions

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *[RequestParserInit](README.md#requestparserinit)*

*Defined in [main/index.ts:590](https://github.com/badbatch/graphql-box/blob/e26041be/packages/request-parser/src/main/index.ts#L590)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *[RequestParserInit](README.md#requestparserinit)*
