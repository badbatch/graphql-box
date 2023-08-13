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

\+ **new RequestParser**(`options`: [UserOptions](../interfaces/useroptions.md)): *[RequestParser](requestparser.md)*

*Defined in [main/index.ts:229](https://github.com/badbatch/graphql-box/blob/870b4903/packages/request-parser/src/main/index.ts#L229)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *[RequestParser](requestparser.md)*

## Methods

###  updateRequest

▸ **updateRequest**(`request`: string, `options`: RequestOptions, `context`: RequestContext): *Promise‹[UpdateRequestResult](../interfaces/updaterequestresult.md)›*

*Implementation of [RequestParserDef](../interfaces/requestparserdef.md)*

*Defined in [main/index.ts:258](https://github.com/badbatch/graphql-box/blob/870b4903/packages/request-parser/src/main/index.ts#L258)*

**Parameters:**

Name | Type |
------ | ------ |
`request` | string |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹[UpdateRequestResult](../interfaces/updaterequestresult.md)›*
