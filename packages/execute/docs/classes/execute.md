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

*Defined in [main/index.ts:28](https://github.com/badbatch/graphql-box/blob/6465c5cc/packages/execute/src/main/index.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[Execute](execute.md)*

## Methods

###  execute

▸ **execute**(`__namedParameters`: object, `options`: ServerRequestOptions, `context`: RequestContext, `executeResolver`: RequestResolver): *Promise‹any›*

*Defined in [main/index.ts:50](https://github.com/badbatch/graphql-box/blob/6465c5cc/packages/execute/src/main/index.ts#L50)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`ast` | any |
`hash` | string |

▪ **options**: *ServerRequestOptions*

▪ **context**: *RequestContext*

▪ **executeResolver**: *RequestResolver*

**Returns:** *Promise‹any›*
