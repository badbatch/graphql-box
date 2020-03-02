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
* [init](requestparser.md#static-init)

## Constructors

###  constructor

\+ **new RequestParser**(`options`: [ConstructorOptions](../interfaces/constructoroptions.md)): *[RequestParser](requestparser.md)*

*Defined in [main/index.ts:244](https://github.com/badbatch/graphql-box/blob/d785ce9/packages/request-parser/src/main/index.ts#L244)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[RequestParser](requestparser.md)*

## Methods

###  updateRequest

▸ **updateRequest**(`request`: string, `options`: RequestOptions, `context`: RequestContext): *Promise‹[UpdateRequestResult](../interfaces/updaterequestresult.md)›*

*Implementation of [RequestParserDef](../interfaces/requestparserdef.md)*

*Defined in [main/index.ts:252](https://github.com/badbatch/graphql-box/blob/d785ce9/packages/request-parser/src/main/index.ts#L252)*

**Parameters:**

Name | Type |
------ | ------ |
`request` | string |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹[UpdateRequestResult](../interfaces/updaterequestresult.md)›*

___

### `Static` init

▸ **init**(`options`: [InitOptions](../interfaces/initoptions.md)): *Promise‹[RequestParser](requestparser.md)›*

*Defined in [main/index.ts:71](https://github.com/badbatch/graphql-box/blob/d785ce9/packages/request-parser/src/main/index.ts#L71)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../interfaces/initoptions.md) |

**Returns:** *Promise‹[RequestParser](requestparser.md)›*
