[Documentation](README.md)

# Documentation

## Index

### Interfaces

* [ConnectionResolverUserOptions](interfaces/connectionresolveruseroptions.md)
* [Getters](interfaces/getters.md)
* [ResourceResponse](interfaces/resourceresponse.md)

### Type aliases

* [CachedEdges](README.md#cachededges)
* [Connection](README.md#connection)
* [ConnectionInputOptions](README.md#connectioninputoptions)
* [ConnectionResolver](README.md#connectionresolver)
* [Context](README.md#context)
* [CreateResourceResolver](README.md#createresourceresolver)
* [CursorCacheEntry](README.md#cursorcacheentry)
* [CursorGroupMetadata](README.md#cursorgroupmetadata)
* [Direction](README.md#direction)
* [Edge](README.md#edge)
* [EndIndexContext](README.md#endindexcontext)
* [GetPageNumbersToRequestContext](README.md#getpagenumberstorequestcontext)
* [HasNextPageParams](README.md#hasnextpageparams)
* [HasPreviousPageParams](README.md#haspreviouspageparams)
* [Indexes](README.md#indexes)
* [IndexesOnCurrentPageContext](README.md#indexesoncurrentpagecontext)
* [Node](README.md#node)
* [PageInfo](README.md#pageinfo)
* [PageNumberContext](README.md#pagenumbercontext)
* [Params](README.md#params)
* [PlainObject](README.md#plainobject)
* [RequestMissingPagesCallback](README.md#requestmissingpagescallback)
* [RequestMissingPagesParams](README.md#requestmissingpagesparams)
* [ResourceResolver](README.md#resourceresolver)
* [StartIndexContext](README.md#startindexcontext)

### Variables

* [connectionInputOptions](README.md#const-connectioninputoptions)

### Functions

* [getCurrentPageEndIndex](README.md#const-getcurrentpageendindex)
* [getCurrentPageStartIndex](README.md#const-getcurrentpagestartindex)
* [getEndCursor](README.md#const-getendcursor)
* [getEndIndex](README.md#const-getendindex)
* [getEndPageNumber](README.md#const-getendpagenumber)
* [getStartCursor](README.md#const-getstartcursor)
* [getStartIndex](README.md#const-getstartindex)
* [getStartPageNumber](README.md#const-getstartpagenumber)
* [hasNextPage](README.md#const-hasnextpage)
* [hasPreviousPage](README.md#const-haspreviouspage)
* [main](README.md#const-main)
* [requestAndCachePages](README.md#const-requestandcachepages)
* [resolveConnection](README.md#const-resolveconnection)

## Type aliases

###  CachedEdges

Ƭ **CachedEdges**: *object*

*Defined in [packages/connection-resolver/src/defs/index.ts:24](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/defs/index.ts#L24)*

#### Type declaration:

* **edges**: *[Edge](README.md#edge)[]*

* **pageNumber**: *number*

___

###  Connection

Ƭ **Connection**: *object*

*Defined in [packages/connection-resolver/src/defs/index.ts:46](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/defs/index.ts#L46)*

#### Type declaration:

* **edges**: *[Edge](README.md#edge)[]*

* **errors**: *Error[]*

* **nodes**: *[Node](README.md#node)[]*

* **pageInfo**: *[PageInfo](README.md#pageinfo)*

* **totalCount**: *number*

___

###  ConnectionInputOptions

Ƭ **ConnectionInputOptions**: *object*

*Defined in [packages/connection-resolver/src/defs/index.ts:107](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/defs/index.ts#L107)*

#### Type declaration:

* **after**? : *undefined | string*

* **before**? : *undefined | string*

* **first**? : *undefined | number*

* **last**? : *undefined | number*

___

###  ConnectionResolver

Ƭ **ConnectionResolver**: *function*

*Defined in [packages/connection-resolver/src/defs/index.ts:100](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/defs/index.ts#L100)*

#### Type declaration:

▸ (`source`: [PlainObject](README.md#plainobject), `args`: [PlainObject](README.md#plainobject) & [ConnectionInputOptions](README.md#connectioninputoptions), `context`: [PlainObject](README.md#plainobject), `info`: GraphQLResolveInfo): *Promise‹[Connection](README.md#connection)›*

**Parameters:**

Name | Type |
------ | ------ |
`source` | [PlainObject](README.md#plainobject) |
`args` | [PlainObject](README.md#plainobject) & [ConnectionInputOptions](README.md#connectioninputoptions) |
`context` | [PlainObject](README.md#plainobject) |
`info` | GraphQLResolveInfo |

___

###  Context

Ƭ **Context**: *object*

*Defined in [packages/connection-resolver/src/defs/index.ts:114](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/defs/index.ts#L114)*

*Defined in [packages/connection-resolver/src/helpers/requestAndCachePages.ts:6](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/requestAndCachePages.ts#L6)*

*Defined in [packages/connection-resolver/src/helpers/getInRangeCachedEdges.ts:4](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/getInRangeCachedEdges.ts#L4)*

*Defined in [packages/connection-resolver/src/helpers/makeEntry.ts:5](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/makeEntry.ts#L5)*

*Defined in [packages/connection-resolver/src/helpers/retrieveCachedEdgesByPage.ts:4](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/retrieveCachedEdgesByPage.ts#L4)*

*Defined in [packages/connection-resolver/src/helpers/retrieveCachedConnection.ts:12](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/retrieveCachedConnection.ts#L12)*

*Defined in [packages/connection-resolver/src/helpers/resolveConnection.ts:11](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/resolveConnection.ts#L11)*

*Defined in [packages/connection-resolver/src/helpers/validateCursor.ts:9](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/validateCursor.ts#L9)*

#### Type declaration:

* **cursorCache**: *Cachemap*

* **groupCursor**: *string*

* **resultsPerPage**: *number*

___

###  CreateResourceResolver

Ƭ **CreateResourceResolver**: *function*

*Defined in [packages/connection-resolver/src/defs/index.ts:63](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/defs/index.ts#L63)*

#### Type declaration:

▸ (`source`: Source, `args`: Args, `context`: Ctx, `info`: GraphQLResolveInfo): *[ResourceResolver](README.md#resourceresolver)‹Resource›*

**Parameters:**

Name | Type |
------ | ------ |
`source` | Source |
`args` | Args |
`context` | Ctx |
`info` | GraphQLResolveInfo |

___

###  CursorCacheEntry

Ƭ **CursorCacheEntry**: *object*

*Defined in [packages/connection-resolver/src/defs/index.ts:12](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/defs/index.ts#L12)*

#### Type declaration:

* **group**: *string*

* **index**: *number*

* **node**: *[Node](README.md#node)*

* **page**: *number*

___

###  CursorGroupMetadata

Ƭ **CursorGroupMetadata**: *object*

*Defined in [packages/connection-resolver/src/defs/index.ts:19](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/defs/index.ts#L19)*

#### Type declaration:

* **totalPages**: *number*

* **totalResults**: *number*

___

###  Direction

Ƭ **Direction**: *"backward" | "forward"*

*Defined in [packages/connection-resolver/src/defs/index.ts:10](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/defs/index.ts#L10)*

___

###  Edge

Ƭ **Edge**: *object*

*Defined in [packages/connection-resolver/src/defs/index.ts:29](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/defs/index.ts#L29)*

#### Type declaration:

* **cursor**: *string*

* **node**: *[Node](README.md#node)*

___

###  EndIndexContext

Ƭ **EndIndexContext**: *object*

*Defined in [packages/connection-resolver/src/helpers/getCurrentPageStartAndEndIndexes.ts:11](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/getCurrentPageStartAndEndIndexes.ts#L11)*

#### Type declaration:

* **endIndex**: *[Indexes](README.md#indexes)*

* **pageIndex**: *number*

* **resultsPerPage**: *number*

* **totalCachedPages**: *number*

___

###  GetPageNumbersToRequestContext

Ƭ **GetPageNumbersToRequestContext**: *object*

*Defined in [packages/connection-resolver/src/helpers/getPageNumbersToRequest.ts:5](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/getPageNumbersToRequest.ts#L5)*

#### Type declaration:

* **endIndex**: *[Indexes](README.md#indexes)*

* **startIndex**: *[Indexes](README.md#indexes)*

___

###  HasNextPageParams

Ƭ **HasNextPageParams**: *object*

*Defined in [packages/connection-resolver/src/helpers/hasPreviousNextPage.ts:9](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/hasPreviousNextPage.ts#L9)*

#### Type declaration:

* **cachedEdgesByPage**: *[CachedEdges](README.md#cachededges)[]*

* **endIndex**: *[Indexes](README.md#indexes)*

* **metadata**: *[CursorGroupMetadata](README.md#cursorgroupmetadata)*

* **resultsPerPage**: *number*

___

###  HasPreviousPageParams

Ƭ **HasPreviousPageParams**: *object*

*Defined in [packages/connection-resolver/src/helpers/hasPreviousNextPage.ts:4](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/hasPreviousNextPage.ts#L4)*

#### Type declaration:

* **cachedEdgesByPage**: *[CachedEdges](README.md#cachededges)[]*

* **startIndex**: *[Indexes](README.md#indexes)*

___

###  Indexes

Ƭ **Indexes**: *object*

*Defined in [packages/connection-resolver/src/defs/index.ts:34](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/defs/index.ts#L34)*

#### Type declaration:

* **absolute**: *number*

* **relative**: *number*

___

###  IndexesOnCurrentPageContext

Ƭ **IndexesOnCurrentPageContext**: *object*

*Defined in [packages/connection-resolver/src/helpers/getIndexesOnCurrentPage.ts:5](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/getIndexesOnCurrentPage.ts#L5)*

#### Type declaration:

* **page**: *number*

___

###  Node

Ƭ **Node**: *[PlainObject](README.md#plainobject) & object*

*Defined in [packages/connection-resolver/src/defs/index.ts:8](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/defs/index.ts#L8)*

___

###  PageInfo

Ƭ **PageInfo**: *object*

*Defined in [packages/connection-resolver/src/defs/index.ts:39](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/defs/index.ts#L39)*

#### Type declaration:

* **endCursor**? : *undefined | string*

* **hasNextPage**: *boolean*

* **hasPreviousPage**: *boolean*

* **startCursor**? : *undefined | string*

___

###  PageNumberContext

Ƭ **PageNumberContext**: *object*

*Defined in [packages/connection-resolver/src/helpers/getStartAndEndPageNumbers.ts:5](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/getStartAndEndPageNumbers.ts#L5)*

#### Type declaration:

* **endIndex**: *[Indexes](README.md#indexes)*

* **page**: *number*

* **startIndex**: *[Indexes](README.md#indexes)*

___

###  Params

Ƭ **Params**: *object*

*Defined in [packages/connection-resolver/src/helpers/cacheCursors.ts:4](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/cacheCursors.ts#L4)*

*Defined in [packages/connection-resolver/src/helpers/isLastPage.ts:1](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/isLastPage.ts#L1)*

*Defined in [packages/connection-resolver/src/helpers/getResultsOnLastPage.ts:1](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/getResultsOnLastPage.ts#L1)*

*Defined in [packages/connection-resolver/src/helpers/isCursorFirst.ts:3](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/isCursorFirst.ts#L3)*

*Defined in [packages/connection-resolver/src/helpers/isCursorLast.ts:4](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/isCursorLast.ts#L4)*

*Defined in [packages/connection-resolver/src/__testUtils__/generateCursorCache.ts:7](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/__testUtils__/generateCursorCache.ts#L7)*

*Defined in [packages/connection-resolver/src/__testUtils__/generatePageResponse.ts:3](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/__testUtils__/generatePageResponse.ts#L3)*

#### Type declaration:

* **resultsPerPage**: *number*

* **totalPages**: *number*

* **totalResults**: *number*

___

###  PlainObject

Ƭ **PlainObject**: *object*

*Defined in [packages/connection-resolver/src/defs/index.ts:4](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/defs/index.ts#L4)*

#### Type declaration:

* \[ **key**: *string*\]: any

___

###  RequestMissingPagesCallback

Ƭ **RequestMissingPagesCallback**: *function*

*Defined in [packages/connection-resolver/src/helpers/requestOutstandingPages.ts:11](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/requestOutstandingPages.ts#L11)*

#### Type declaration:

▸ (`params`: object): *Promise‹any›*

**Parameters:**

▪ **params**: *object*

Name | Type |
------ | ------ |
`nextPage` | number |

___

###  RequestMissingPagesParams

Ƭ **RequestMissingPagesParams**: *object*

*Defined in [packages/connection-resolver/src/helpers/requestOutstandingPages.ts:1](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/requestOutstandingPages.ts#L1)*

#### Type declaration:

* **count**: *number*

* **direction**: *"forward" | "backward"*

* **page**: *number*

* **results**: *number*

* **resultsPerPage**: *number*

* **totalPages**: *number*

* **totalResults**: *number*

___

###  ResourceResolver

Ƭ **ResourceResolver**: *function*

*Defined in [packages/connection-resolver/src/defs/index.ts:59](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/defs/index.ts#L59)*

#### Type declaration:

▸ (`args`: object): *Promise‹[ResourceResponse](interfaces/resourceresponse.md)‹Resource››*

**Parameters:**

▪ **args**: *object*

Name | Type |
------ | ------ |
`page` | number |

___

###  StartIndexContext

Ƭ **StartIndexContext**: *object*

*Defined in [packages/connection-resolver/src/helpers/getCurrentPageStartAndEndIndexes.ts:3](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/getCurrentPageStartAndEndIndexes.ts#L3)*

#### Type declaration:

* **pageIndex**: *number*

* **startIndex**: *[Indexes](README.md#indexes)*

## Variables

### `Const` connectionInputOptions

• **connectionInputOptions**: *string[]* = ["after", "before", "first", "last"]

*Defined in [packages/connection-resolver/src/helpers/removeConnectionInputOptions.ts:3](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/removeConnectionInputOptions.ts#L3)*

## Functions

### `Const` getCurrentPageEndIndex

▸ **getCurrentPageEndIndex**(`__namedParameters`: object): *number*

*Defined in [packages/connection-resolver/src/helpers/getCurrentPageStartAndEndIndexes.ts:18](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/getCurrentPageStartAndEndIndexes.ts#L18)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`endIndex` | object |
`pageIndex` | number |
`resultsPerPage` | number |
`totalCachedPages` | number |

**Returns:** *number*

___

### `Const` getCurrentPageStartIndex

▸ **getCurrentPageStartIndex**(`__namedParameters`: object): *number*

*Defined in [packages/connection-resolver/src/helpers/getCurrentPageStartAndEndIndexes.ts:8](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/getCurrentPageStartAndEndIndexes.ts#L8)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`pageIndex` | number |
`startIndex` | object |

**Returns:** *number*

___

### `Const` getEndCursor

▸ **getEndCursor**(`edges`: [Edge](README.md#edge)[]): *string*

*Defined in [packages/connection-resolver/src/helpers/getStartAndEndCursors.ts:5](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/getStartAndEndCursors.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`edges` | [Edge](README.md#edge)[] |

**Returns:** *string*

___

### `Const` getEndIndex

▸ **getEndIndex**(`args`: [ConnectionInputOptions](README.md#connectioninputoptions), `__namedParameters`: object): *object*

*Defined in [packages/connection-resolver/src/helpers/getStartAndEndIndexes.ts:33](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/getStartAndEndIndexes.ts#L33)*

**Parameters:**

▪ **args**: *[ConnectionInputOptions](README.md#connectioninputoptions)*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`entry` | object |
`metadata` | object |
`resultsPerPage` | number |

**Returns:** *object*

* **absolute**: *number* = index - 1

* **relative**: *number* = index - 1

___

### `Const` getEndPageNumber

▸ **getEndPageNumber**(`args`: [ConnectionInputOptions](README.md#connectioninputoptions), `__namedParameters`: object): *number*

*Defined in [packages/connection-resolver/src/helpers/getStartAndEndPageNumbers.ts:23](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/getStartAndEndPageNumbers.ts#L23)*

**Parameters:**

▪ **args**: *[ConnectionInputOptions](README.md#connectioninputoptions)*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`endIndex` | object |
`metadata` | object |
`page` | number |
`resultsPerPage` | number |

**Returns:** *number*

___

### `Const` getStartCursor

▸ **getStartCursor**(`edges`: [Edge](README.md#edge)[]): *string*

*Defined in [packages/connection-resolver/src/helpers/getStartAndEndCursors.ts:3](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/getStartAndEndCursors.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`edges` | [Edge](README.md#edge)[] |

**Returns:** *string*

___

### `Const` getStartIndex

▸ **getStartIndex**(`args`: [ConnectionInputOptions](README.md#connectioninputoptions), `__namedParameters`: object): *object*

*Defined in [packages/connection-resolver/src/helpers/getStartAndEndIndexes.ts:8](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/getStartAndEndIndexes.ts#L8)*

**Parameters:**

▪ **args**: *[ConnectionInputOptions](README.md#connectioninputoptions)*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`entry` | object |
`resultsPerPage` | number |

**Returns:** *object*

* **absolute**: *number* = index + 1

* **relative**: *number* = index + 1

___

### `Const` getStartPageNumber

▸ **getStartPageNumber**(`args`: [ConnectionInputOptions](README.md#connectioninputoptions), `__namedParameters`: object): *number*

*Defined in [packages/connection-resolver/src/helpers/getStartAndEndPageNumbers.ts:11](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/getStartAndEndPageNumbers.ts#L11)*

**Parameters:**

▪ **args**: *[ConnectionInputOptions](README.md#connectioninputoptions)*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`page` | number |
`resultsPerPage` | number |
`startIndex` | object |

**Returns:** *number*

___

### `Const` hasNextPage

▸ **hasNextPage**(`__namedParameters`: object): *boolean*

*Defined in [packages/connection-resolver/src/helpers/hasPreviousNextPage.ts:19](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/hasPreviousNextPage.ts#L19)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`cachedEdgesByPage` | object[] |
`endIndex` | object |
`metadata` | object |
`resultsPerPage` | number |

**Returns:** *boolean*

___

### `Const` hasPreviousPage

▸ **hasPreviousPage**(`__namedParameters`: object): *boolean*

*Defined in [packages/connection-resolver/src/helpers/hasPreviousNextPage.ts:16](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/hasPreviousNextPage.ts#L16)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`cachedEdgesByPage` | object[] |
`startIndex` | object |

**Returns:** *boolean*

___

### `Const` main

▸ **main**‹**Source**, **Args**, **Ctx**, **Resource**, **ResourceNode**›(`__namedParameters`: object): *(Anonymous function)*

*Defined in [packages/connection-resolver/src/main/index.ts:8](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/main/index.ts#L8)*

**Type parameters:**

▪ **Source**: *[PlainObject](README.md#plainobject) | undefined*

▪ **Args**: *[PlainObject](README.md#plainobject)*

▪ **Ctx**: *[PlainObject](README.md#plainobject)*

▪ **Resource**: *[PlainObject](README.md#plainobject)*

▪ **ResourceNode**: *[Node](README.md#node)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`createMakeCursors` | function |
`createResourceResolver` | function |
`cursorCache` | Core‹› |
`getters` | [Getters](interfaces/getters.md)‹Resource, ResourceNode› |
`resultsPerPage` | number |
`resolver` |  |

**Returns:** *(Anonymous function)*

___

### `Const` requestAndCachePages

▸ **requestAndCachePages**‹**Resource**, **ResourceNode**›(`pages`: number[], `__namedParameters`: object): *Promise‹object›*

*Defined in [packages/connection-resolver/src/helpers/requestAndCachePages.ts:14](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/requestAndCachePages.ts#L14)*

**Type parameters:**

▪ **Resource**: *[PlainObject](README.md#plainobject)*

▪ **ResourceNode**: *[Node](README.md#node)*

**Parameters:**

▪ **pages**: *number[]*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`cursorCache` | Core‹› |
`getters` | [Getters](interfaces/getters.md)‹Resource, ResourceNode› |
`groupCursor` | string |
`makeIDCursor` | function |
`resourceResolver` | function |

**Returns:** *Promise‹object›*

___

### `Const` resolveConnection

▸ **resolveConnection**‹**Resource**, **ResourceNode**›(`args`: [PlainObject](README.md#plainobject) & [ConnectionInputOptions](README.md#connectioninputoptions), `__namedParameters`: object): *Promise‹object›*

*Defined in [packages/connection-resolver/src/helpers/resolveConnection.ts:20](https://github.com/badbatch/graphql-box/blob/c5fe32a/packages/connection-resolver/src/helpers/resolveConnection.ts#L20)*

**Type parameters:**

▪ **Resource**: *[PlainObject](README.md#plainobject)*

▪ **ResourceNode**: *[Node](README.md#node)*

**Parameters:**

▪ **args**: *[PlainObject](README.md#plainobject) & [ConnectionInputOptions](README.md#connectioninputoptions)*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`cursorCache` | Core‹› |
`getters` | [Getters](interfaces/getters.md)‹Resource, ResourceNode› |
`groupCursor` | string |
`makeIDCursor` | function |
`resourceResolver` | function |
`resultsPerPage` | number |

**Returns:** *Promise‹object›*
