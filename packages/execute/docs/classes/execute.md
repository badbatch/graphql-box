[Documentation](../README.md) › [Execute](execute.md)

# Class: Execute

## Hierarchy

* **Execute**

## Implements

* RequestManagerDef

## Index

### Constructors

* [constructor](execute.md#constructor)

### Methods

* [execute](execute.md#execute)

## Constructors

###  constructor

\+ **new Execute**(`options`: [ConstructorOptions](../README.md#constructoroptions)): *[Execute](execute.md)*

*Defined in [main/index.ts:27](https://github.com/badbatch/graphql-box/blob/5db63dc/packages/execute/src/main/index.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[Execute](execute.md)*

## Methods

###  execute

▸ **execute**(`__namedParameters`: object, `options`: ServerRequestOptions, `context`: RequestContext, `executeResolver`: RequestResolver): *Promise‹any›*

*Defined in [main/index.ts:49](https://github.com/badbatch/graphql-box/blob/5db63dc/packages/execute/src/main/index.ts#L49)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`ast` | any |
`hash` | string |
`request` | string |

▪ **options**: *ServerRequestOptions*

▪ **context**: *RequestContext*

▪ **executeResolver**: *RequestResolver*

**Returns:** *Promise‹any›*
