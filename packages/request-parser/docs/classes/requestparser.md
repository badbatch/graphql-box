> **[Documentation](../README.md)**

[RequestParser](requestparser.md) /

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

*Defined in [main/index.ts:246](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/request-parser/src/main/index.ts#L246)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[RequestParser](requestparser.md)*

## Methods

###  updateRequest

▸ **updateRequest**(`request`: string, `options`: `RequestOptions`, `context`: `RequestContext`): *`Promise<UpdateRequestResult>`*

*Implementation of [RequestParserDef](../interfaces/requestparserdef.md)*

*Defined in [main/index.ts:254](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/request-parser/src/main/index.ts#L254)*

**Parameters:**

Name | Type |
------ | ------ |
`request` | string |
`options` | `RequestOptions` |
`context` | `RequestContext` |

**Returns:** *`Promise<UpdateRequestResult>`*

___

### `Static` init

▸ **init**(`options`: [InitOptions](../interfaces/initoptions.md)): *`Promise<RequestParser>`*

*Defined in [main/index.ts:71](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/request-parser/src/main/index.ts#L71)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../interfaces/initoptions.md) |

**Returns:** *`Promise<RequestParser>`*