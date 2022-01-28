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

*Defined in [main/index.ts:33](https://github.com/badbatch/graphql-box/blob/f8ef82d/packages/execute/src/main/index.ts#L33)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[Execute](execute.md)*

## Methods

###  execute

▸ **execute**(`__namedParameters`: object, `options`: ServerRequestOptions, `__namedParameters`: object): *Promise‹MaybeRawResponseData›*

*Defined in [main/index.ts:44](https://github.com/badbatch/graphql-box/blob/f8ef82d/packages/execute/src/main/index.ts#L44)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`ast` | undefined &#124; DocumentNode |
`request` | string |

▪ **options**: *ServerRequestOptions*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`boxID` | string |

**Returns:** *Promise‹MaybeRawResponseData›*

___

### `Static` init

▸ **init**(`options`: [InitOptions](../README.md#initoptions)): *Promise‹[Execute](execute.md)›*

*Defined in [main/index.ts:17](https://github.com/badbatch/graphql-box/blob/f8ef82d/packages/execute/src/main/index.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../README.md#initoptions) |

**Returns:** *Promise‹[Execute](execute.md)›*
