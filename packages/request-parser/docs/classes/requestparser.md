[Documentation](../README.md) › [RequestParser](requestparser.md)

# Class: RequestParser

## Hierarchy

* **RequestParser**

## Implements

* [RequestParserDef](../interfaces/requestparserdef.md)

## Index

### Constructors

* [constructor](requestparser.md#constructor)

### Methods

* [updateRequest](requestparser.md#updaterequest)

## Constructors

###  constructor

\+ **new RequestParser**(`options`: [ConstructorOptions](../README.md#constructoroptions)): *[RequestParser](requestparser.md)*

*Defined in [main/index.ts:230](https://github.com/badbatch/graphql-box/blob/c173ad2/packages/request-parser/src/main/index.ts#L230)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[RequestParser](requestparser.md)*

## Methods

###  updateRequest

▸ **updateRequest**(`request`: string, `options`: RequestOptions, `context`: RequestContext): *Promise‹[UpdateRequestResult](../interfaces/updaterequestresult.md)›*

*Implementation of [RequestParserDef](../interfaces/requestparserdef.md)*

*Defined in [main/index.ts:259](https://github.com/badbatch/graphql-box/blob/c173ad2/packages/request-parser/src/main/index.ts#L259)*

**Parameters:**

Name | Type |
------ | ------ |
`request` | string |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹[UpdateRequestResult](../interfaces/updaterequestresult.md)›*
