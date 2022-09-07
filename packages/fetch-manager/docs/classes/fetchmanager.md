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
* [log](fetchmanager.md#log)

## Constructors

###  constructor

\+ **new FetchManager**(`options`: [ConstructorOptions](../README.md#constructoroptions)): *[FetchManager](fetchmanager.md)*

*Defined in [main/index.ts:77](https://github.com/badbatch/graphql-box/blob/67c318bd/packages/fetch-manager/src/main/index.ts#L77)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[FetchManager](fetchmanager.md)*

## Methods

###  execute

▸ **execute**(`__namedParameters`: object, `options`: RequestOptions, `context`: RequestContext, `executeResolver`: RequestResolver): *Promise‹MaybeRawResponseData | object | AsyncIterableIterator‹undefined | MaybeRequestResult››*

*Defined in [main/index.ts:102](https://github.com/badbatch/graphql-box/blob/67c318bd/packages/fetch-manager/src/main/index.ts#L102)*

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

▸ **log**(`message`: string, `data`: PlainObjectMap, `logLevel?`: LogLevel): *Promise‹MaybeRawResponseData | MaybeRawFetchData | AsyncGenerator‹Response, any, unknown››*

*Defined in [main/index.ts:171](https://github.com/badbatch/graphql-box/blob/67c318bd/packages/fetch-manager/src/main/index.ts#L171)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |
`data` | PlainObjectMap |
`logLevel?` | LogLevel |

**Returns:** *Promise‹MaybeRawResponseData | MaybeRawFetchData | AsyncGenerator‹Response, any, unknown››*
