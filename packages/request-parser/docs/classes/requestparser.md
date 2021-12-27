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

*Defined in [main/index.ts:245](https://github.com/badbatch/graphql-box/blob/5ac2bea/packages/request-parser/src/main/index.ts#L245)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[RequestParser](requestparser.md)*

## Methods

###  updateRequest

▸ **updateRequest**(`request`: string, `options`: RequestOptions, `context`: RequestContext): *Promise‹[UpdateRequestResult](../interfaces/updaterequestresult.md)›*

*Implementation of [RequestParserDef](../interfaces/requestparserdef.md)*

*Defined in [main/index.ts:253](https://github.com/badbatch/graphql-box/blob/5ac2bea/packages/request-parser/src/main/index.ts#L253)*

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

*Defined in [main/index.ts:72](https://github.com/badbatch/graphql-box/blob/5ac2bea/packages/request-parser/src/main/index.ts#L72)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../interfaces/initoptions.md) |

**Returns:** *Promise‹[RequestParser](requestparser.md)›*
