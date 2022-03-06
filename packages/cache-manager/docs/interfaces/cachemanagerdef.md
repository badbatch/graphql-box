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

*Defined in [cache-manager/src/defs/index.ts:190](https://github.com/badbatch/graphql-box/blob/f0217fe/packages/cache-manager/src/defs/index.ts#L190)*

## Methods

###  analyzeQuery

▸ **analyzeQuery**(`requestData`: RequestData, `options`: RequestOptions, `context`: RequestContext): *Promise‹[AnalyzeQueryResult](analyzequeryresult.md)›*

*Defined in [cache-manager/src/defs/index.ts:191](https://github.com/badbatch/graphql-box/blob/f0217fe/packages/cache-manager/src/defs/index.ts#L191)*

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

*Defined in [cache-manager/src/defs/index.ts:192](https://github.com/badbatch/graphql-box/blob/f0217fe/packages/cache-manager/src/defs/index.ts#L192)*

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

*Defined in [cache-manager/src/defs/index.ts:199](https://github.com/badbatch/graphql-box/blob/f0217fe/packages/cache-manager/src/defs/index.ts#L199)*

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

*Defined in [cache-manager/src/defs/index.ts:205](https://github.com/badbatch/graphql-box/blob/f0217fe/packages/cache-manager/src/defs/index.ts#L205)*

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

*Defined in [cache-manager/src/defs/index.ts:211](https://github.com/badbatch/graphql-box/blob/f0217fe/packages/cache-manager/src/defs/index.ts#L211)*

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

*Defined in [cache-manager/src/defs/index.ts:216](https://github.com/badbatch/graphql-box/blob/f0217fe/packages/cache-manager/src/defs/index.ts#L216)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string |

**Returns:** *void*
