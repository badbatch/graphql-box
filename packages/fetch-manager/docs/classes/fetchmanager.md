[Documentation](../README.md) › [FetchManager](fetchmanager.md)

# Class: FetchManager

## Hierarchy

* **FetchManager**

## Index

### Constructors

* [constructor](fetchmanager.md#constructor)

### Methods

* [execute](fetchmanager.md#execute)
* [log](fetchmanager.md#log)

## Constructors

###  constructor

\+ **new FetchManager**(`options`: [ConstructorOptions](../README.md#constructoroptions)): *[FetchManager](fetchmanager.md)*

*Defined in [main/index.ts:75](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/fetch-manager/src/main/index.ts#L75)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[FetchManager](fetchmanager.md)*

## Methods

###  execute

▸ **execute**(`__namedParameters`: object, `options`: RequestOptions, `context`: RequestContext, `executeResolver`: RequestResolver): *Promise‹MaybeRawResponseData | object | AsyncIterableIterator‹undefined | MaybeRequestResult››*

*Defined in [main/index.ts:100](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/fetch-manager/src/main/index.ts#L100)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`hash` | string |
`request` | string |

▪ **options**: *RequestOptions*

▪ **context**: *RequestContext*

▪ **executeResolver**: *RequestResolver*

**Returns:** *Promise‹MaybeRawResponseData | object | AsyncIterableIterator‹undefined | MaybeRequestResult››*

___

###  log

▸ **log**(`message`: string, `data`: PlainObjectMap, `logLevel?`: LogLevel): *void*

*Defined in [main/index.ts:169](https://github.com/badbatch/graphql-box/blob/be6f26db/packages/fetch-manager/src/main/index.ts#L169)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |
`data` | PlainObjectMap |
`logLevel?` | LogLevel |

**Returns:** *void*
