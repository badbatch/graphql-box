[Documentation](../README.md) › [CacheManager](cachemanager.md)

# Class: CacheManager

## Hierarchy

* **CacheManager**

## Implements

* [CacheManagerDef](../interfaces/cachemanagerdef.md)

## Index

### Constructors

* [constructor](cachemanager.md#constructor)

### Accessors

* [cache](cachemanager.md#cache)

### Methods

* [analyzeQuery](cachemanager.md#analyzequery)
* [cacheQuery](cachemanager.md#cachequery)
* [cacheResponse](cachemanager.md#cacheresponse)
* [checkCacheEntry](cachemanager.md#checkcacheentry)
* [checkQueryResponseCacheEntry](cachemanager.md#checkqueryresponsecacheentry)
* [deletePartialQueryResponse](cachemanager.md#deletepartialqueryresponse)
* [setQueryResponseCacheEntry](cachemanager.md#setqueryresponsecacheentry)

## Constructors

###  constructor

\+ **new CacheManager**(`options`: [UserOptions](../interfaces/useroptions.md)): *[CacheManager](cachemanager.md)*

*Defined in [cache-manager/src/main/index.ts:213](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/cache-manager/src/main/index.ts#L213)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UserOptions](../interfaces/useroptions.md) |

**Returns:** *[CacheManager](cachemanager.md)*

## Accessors

###  cache

• **get cache**(): *Cachemap*

*Defined in [cache-manager/src/main/index.ts:238](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/cache-manager/src/main/index.ts#L238)*

**Returns:** *Cachemap*

## Methods

###  analyzeQuery

▸ **analyzeQuery**(`requestData`: RequestData, `options`: RequestOptions, `context`: RequestContext): *Promise‹[AnalyzeQueryResult](../interfaces/analyzequeryresult.md)›*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [cache-manager/src/main/index.ts:242](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/cache-manager/src/main/index.ts#L242)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹[AnalyzeQueryResult](../interfaces/analyzequeryresult.md)›*

___

###  cacheQuery

▸ **cacheQuery**(`requestData`: RequestData, `updatedRequestData`: RequestData | undefined, `rawResponseData`: RawResponseDataWithMaybeCacheMetadata, `options`: RequestOptions, `context`: RequestContext): *Promise‹ResponseData›*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [cache-manager/src/main/index.ts:287](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/cache-manager/src/main/index.ts#L287)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`updatedRequestData` | RequestData &#124; undefined |
`rawResponseData` | RawResponseDataWithMaybeCacheMetadata |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹ResponseData›*

___

###  cacheResponse

▸ **cacheResponse**(`requestData`: RequestData, `rawResponseData`: RawResponseDataWithMaybeCacheMetadata, `options`: RequestOptions, `context`: RequestContext): *Promise‹ResponseData›*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [cache-manager/src/main/index.ts:303](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/cache-manager/src/main/index.ts#L303)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`rawResponseData` | RawResponseDataWithMaybeCacheMetadata |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹ResponseData›*

___

###  checkCacheEntry

▸ **checkCacheEntry**(`cacheType`: CacheTypes, `hash`: string, `options`: RequestOptions, `context`: RequestContext & object): *Promise‹[CheckCacheEntryResult](../interfaces/checkcacheentryresult.md) | false›*

*Defined in [cache-manager/src/main/index.ts:318](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/cache-manager/src/main/index.ts#L318)*

**Parameters:**

Name | Type |
------ | ------ |
`cacheType` | CacheTypes |
`hash` | string |
`options` | RequestOptions |
`context` | RequestContext & object |

**Returns:** *Promise‹[CheckCacheEntryResult](../interfaces/checkcacheentryresult.md) | false›*

___

###  checkQueryResponseCacheEntry

▸ **checkQueryResponseCacheEntry**(`hash`: string, `options`: RequestOptions, `context`: RequestContext): *Promise‹ResponseData | false›*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [cache-manager/src/main/index.ts:327](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/cache-manager/src/main/index.ts#L327)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹ResponseData | false›*

___

###  deletePartialQueryResponse

▸ **deletePartialQueryResponse**(`hash`: string): *void*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [cache-manager/src/main/index.ts:346](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/cache-manager/src/main/index.ts#L346)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string |

**Returns:** *void*

___

###  setQueryResponseCacheEntry

▸ **setQueryResponseCacheEntry**(`requestData`: RequestData, `responseData`: ResponseData, `options`: RequestOptions, `context`: [CacheManagerContext](../interfaces/cachemanagercontext.md)): *Promise‹void›*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [cache-manager/src/main/index.ts:350](https://github.com/badbatch/graphql-box/blob/0f66f3fd/packages/cache-manager/src/main/index.ts#L350)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`responseData` | ResponseData |
`options` | RequestOptions |
`context` | [CacheManagerContext](../interfaces/cachemanagercontext.md) |

**Returns:** *Promise‹void›*
