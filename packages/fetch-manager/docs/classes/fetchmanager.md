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

\+ **new FetchManager**(`options`: [UserOptions](../interfaces/useroptions.md)): *[FetchManager](fetchmanager.md)*

*Defined in [main/index.ts:74](https://github.com/badbatch/graphql-box/blob/85ed3ddc/packages/fetch-manager/src/main/index.ts#L74)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *[FetchManager](fetchmanager.md)*

## Methods

###  execute

▸ **execute**(`__namedParameters`: object, `options`: RequestOptions, `context`: RequestContext, `executeResolver`: RequestResolver): *Promise‹MaybeRawResponseData | object | AsyncIterableIterator‹undefined | MaybeRequestResult››*

*Defined in [main/index.ts:99](https://github.com/badbatch/graphql-box/blob/85ed3ddc/packages/fetch-manager/src/main/index.ts#L99)*

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

*Defined in [main/index.ts:168](https://github.com/badbatch/graphql-box/blob/85ed3ddc/packages/fetch-manager/src/main/index.ts#L168)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |
`data` | PlainObjectMap |
`logLevel?` | LogLevel |

**Returns:** *void*
