[Documentation](../README.md) › [Execute](execute.md)

# Class: Execute

## Hierarchy

* **Execute**

## Index

### Constructors

* [constructor](execute.md#constructor)

### Methods

* [execute](execute.md#execute)

## Constructors

###  constructor

\+ **new Execute**(`options`: [UserOptions](../interfaces/useroptions.md)): *[Execute](execute.md)*

*Defined in [main/index.ts:25](https://github.com/badbatch/graphql-box/blob/a215d380/packages/execute/src/main/index.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *[Execute](execute.md)*

## Methods

###  execute

▸ **execute**(`__namedParameters`: object, `options`: ServerRequestOptions, `context`: RequestContext, `executeResolver`: RequestResolver): *Promise‹any›*

*Defined in [main/index.ts:47](https://github.com/badbatch/graphql-box/blob/a215d380/packages/execute/src/main/index.ts#L47)*

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
