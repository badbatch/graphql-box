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
* [checkCacheEntry](cachemanagerdef.md#checkcacheentry)
* [checkQueryResponseCacheEntry](cachemanagerdef.md#checkqueryresponsecacheentry)
* [deletePartialQueryResponse](cachemanagerdef.md#deletepartialqueryresponse)
* [resolveQuery](cachemanagerdef.md#resolvequery)
* [resolveRequest](cachemanagerdef.md#resolverequest)

## Properties

###  cache

• **cache**: *Cachemap*

*Defined in [defs/index.ts:182](https://github.com/badbatch/graphql-box/blob/1d38e3b/packages/cache-manager/src/defs/index.ts#L182)*

## Methods

###  analyzeQuery

▸ **analyzeQuery**(`requestData`: RequestData, `options`: RequestOptions, `context`: RequestContext): *Promise‹[AnalyzeQueryResult](analyzequeryresult.md)›*

*Defined in [defs/index.ts:183](https://github.com/badbatch/graphql-box/blob/1d38e3b/packages/cache-manager/src/defs/index.ts#L183)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹[AnalyzeQueryResult](analyzequeryresult.md)›*

___

###  checkCacheEntry

▸ **checkCacheEntry**(`cacheType`: CacheTypes, `hash`: string, `options`: RequestOptions, `context`: RequestContext): *Promise‹[CheckCacheEntryResult](checkcacheentryresult.md) | false›*

*Defined in [defs/index.ts:184](https://github.com/badbatch/graphql-box/blob/1d38e3b/packages/cache-manager/src/defs/index.ts#L184)*

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

*Defined in [defs/index.ts:190](https://github.com/badbatch/graphql-box/blob/1d38e3b/packages/cache-manager/src/defs/index.ts#L190)*

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

*Defined in [defs/index.ts:195](https://github.com/badbatch/graphql-box/blob/1d38e3b/packages/cache-manager/src/defs/index.ts#L195)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string |

**Returns:** *void*

___

###  resolveQuery

▸ **resolveQuery**(`requestData`: RequestData, `updatedRequestData`: RequestData, `responseData`: RawResponseDataWithMaybeCacheMetadata, `options`: RequestOptions, `context`: RequestContext): *Promise‹ResponseData›*

*Defined in [defs/index.ts:196](https://github.com/badbatch/graphql-box/blob/1d38e3b/packages/cache-manager/src/defs/index.ts#L196)*

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

###  resolveRequest

▸ **resolveRequest**(`requestData`: RequestData, `responseData`: RawResponseDataWithMaybeCacheMetadata, `options`: RequestOptions, `context`: RequestContext): *Promise‹ResponseData›*

*Defined in [defs/index.ts:203](https://github.com/badbatch/graphql-box/blob/1d38e3b/packages/cache-manager/src/defs/index.ts#L203)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`responseData` | RawResponseDataWithMaybeCacheMetadata |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹ResponseData›*
