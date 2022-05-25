[Documentation](../README.md) › [CacheManagerDef](cachemanagerdef.md)

# Interface: CacheManagerDef

## Hierarchy

* **CacheManagerDef**

## Implemented by

* [CacheManager](../classes/cachemanager.md)

## Index

### Properties

* [cache](cachemanagerdef.md#cache)

### Methods

* [analyzeQuery](cachemanagerdef.md#analyzequery)
* [cacheQuery](cachemanagerdef.md#cachequery)
* [cacheResponse](cachemanagerdef.md#cacheresponse)
* [checkCacheEntry](cachemanagerdef.md#checkcacheentry)
* [checkQueryResponseCacheEntry](cachemanagerdef.md#checkqueryresponsecacheentry)
* [deletePartialQueryResponse](cachemanagerdef.md#deletepartialqueryresponse)

## Properties

###  cache

• **cache**: *Cachemap*

*Defined in [cache-manager/src/defs/index.ts:183](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/cache-manager/src/defs/index.ts#L183)*

## Methods

###  analyzeQuery

▸ **analyzeQuery**(`requestData`: RequestData, `options`: RequestOptions, `context`: RequestContext): *Promise‹[AnalyzeQueryResult](analyzequeryresult.md)›*

*Defined in [cache-manager/src/defs/index.ts:184](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/cache-manager/src/defs/index.ts#L184)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹[AnalyzeQueryResult](analyzequeryresult.md)›*

___

###  cacheQuery

▸ **cacheQuery**(`requestData`: RequestData, `updatedRequestData`: RequestData, `responseData`: RawResponseDataWithMaybeCacheMetadata, `options`: RequestOptions, `context`: RequestContext): *Promise‹ResponseData›*

*Defined in [cache-manager/src/defs/index.ts:185](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/cache-manager/src/defs/index.ts#L185)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`updatedRequestData` | RequestData |
`responseData` | RawResponseDataWithMaybeCacheMetadata |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹ResponseData›*

___

###  cacheResponse

▸ **cacheResponse**(`requestData`: RequestData, `responseData`: RawResponseDataWithMaybeCacheMetadata, `options`: RequestOptions, `context`: RequestContext): *Promise‹ResponseData›*

*Defined in [cache-manager/src/defs/index.ts:192](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/cache-manager/src/defs/index.ts#L192)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`responseData` | RawResponseDataWithMaybeCacheMetadata |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹ResponseData›*

___

###  checkCacheEntry

▸ **checkCacheEntry**(`cacheType`: CacheTypes, `hash`: string, `options`: RequestOptions, `context`: RequestContext): *Promise‹[CheckCacheEntryResult](checkcacheentryresult.md) | false›*

*Defined in [cache-manager/src/defs/index.ts:198](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/cache-manager/src/defs/index.ts#L198)*

**Parameters:**

Name | Type |
------ | ------ |
`cacheType` | CacheTypes |
`hash` | string |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹[CheckCacheEntryResult](checkcacheentryresult.md) | false›*

___

###  checkQueryResponseCacheEntry

▸ **checkQueryResponseCacheEntry**(`hash`: string, `options`: RequestOptions, `context`: RequestContext): *Promise‹ResponseData | false›*

*Defined in [cache-manager/src/defs/index.ts:204](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/cache-manager/src/defs/index.ts#L204)*

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

*Defined in [cache-manager/src/defs/index.ts:209](https://github.com/badbatch/graphql-box/blob/db0ab9f/packages/cache-manager/src/defs/index.ts#L209)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string |

**Returns:** *void*
