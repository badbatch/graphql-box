[Documentation](../README.md) › [FetchManager](fetchmanager.md)

# Class: FetchManager

## Hierarchy

* **FetchManager**

## Implements

* RequestManagerDef

## Index

### Constructors

* [constructor](fetchmanager.md#constructor)

### Methods

* [execute](fetchmanager.md#execute)
* [init](fetchmanager.md#static-init)

## Constructors

###  constructor

\+ **new FetchManager**(`options`: [ConstructorOptions](../README.md#constructoroptions)): *[FetchManager](fetchmanager.md)*

*Defined in [main/index.ts:71](https://github.com/badbatch/graphql-box/blob/313a3bd/packages/fetch-manager/src/main/index.ts#L71)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[FetchManager](fetchmanager.md)*

## Methods

###  execute

▸ **execute**(`__namedParameters`: object, `_options`: RequestOptions, `context`: RequestContext): *Promise‹MaybeRawResponseData›*

*Defined in [main/index.ts:83](https://github.com/badbatch/graphql-box/blob/313a3bd/packages/fetch-manager/src/main/index.ts#L83)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`hash` | string |
`request` | string |

▪ **_options**: *RequestOptions*

▪ **context**: *RequestContext*

**Returns:** *Promise‹MaybeRawResponseData›*

___

### `Static` init

▸ **init**(`options`: [InitOptions](../README.md#initoptions)): *Promise‹[FetchManager](fetchmanager.md)›*

*Defined in [main/index.ts:26](https://github.com/badbatch/graphql-box/blob/313a3bd/packages/fetch-manager/src/main/index.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../README.md#initoptions) |

**Returns:** *Promise‹[FetchManager](fetchmanager.md)›*
