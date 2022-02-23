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

*Defined in [main/index.ts:80](https://github.com/badbatch/graphql-box/blob/4ea76f5/packages/fetch-manager/src/main/index.ts#L80)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[FetchManager](fetchmanager.md)*

## Methods

###  execute

▸ **execute**(`__namedParameters`: object, `_options`: RequestOptions, `context`: RequestContext, `executeResolver`: RequestResolver): *Promise‹MaybeRawResponseData | AsyncIterableIterator‹undefined | MaybeResponseData››*

*Defined in [main/index.ts:93](https://github.com/badbatch/graphql-box/blob/4ea76f5/packages/fetch-manager/src/main/index.ts#L93)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`hash` | string |
`request` | string |

▪ **_options**: *RequestOptions*

▪ **context**: *RequestContext*

▪ **executeResolver**: *RequestResolver*

**Returns:** *Promise‹MaybeRawResponseData | AsyncIterableIterator‹undefined | MaybeResponseData››*

___

### `Static` init

▸ **init**(`options`: [InitOptions](../README.md#initoptions)): *Promise‹[FetchManager](fetchmanager.md)›*

*Defined in [main/index.ts:34](https://github.com/badbatch/graphql-box/blob/4ea76f5/packages/fetch-manager/src/main/index.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../README.md#initoptions) |

**Returns:** *Promise‹[FetchManager](fetchmanager.md)›*
