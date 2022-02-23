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
* [init](execute.md#static-init)

## Constructors

###  constructor

\+ **new Execute**(`options`: [ConstructorOptions](../README.md#constructoroptions)): *[Execute](execute.md)*

*Defined in [main/index.ts:39](https://github.com/badbatch/graphql-box/blob/d6cf575/packages/execute/src/main/index.ts#L39)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[Execute](execute.md)*

## Methods

###  execute

▸ **execute**(`__namedParameters`: object, `options`: ServerRequestOptions, `__namedParameters`: object, `executeResolver`: RequestResolver): *Promise‹any›*

*Defined in [main/index.ts:51](https://github.com/badbatch/graphql-box/blob/d6cf575/packages/execute/src/main/index.ts#L51)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`ast` | any |
`hash` | string |
`request` | string |

▪ **options**: *ServerRequestOptions*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`boxID` | string |

▪ **executeResolver**: *RequestResolver*

**Returns:** *Promise‹any›*

___

### `Static` init

▸ **init**(`options`: [InitOptions](../README.md#initoptions)): *Promise‹[Execute](execute.md)›*

*Defined in [main/index.ts:22](https://github.com/badbatch/graphql-box/blob/d6cf575/packages/execute/src/main/index.ts#L22)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../README.md#initoptions) |

**Returns:** *Promise‹[Execute](execute.md)›*
