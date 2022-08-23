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
* [setQueryResponseCacheEntry](cachemanagerdef.md#setqueryresponsecacheentry)

## Properties

###  cache

• **cache**: *Cachemap*

*Defined in [cache-manager/src/defs/index.ts:168](https://github.com/badbatch/graphql-box/blob/3fa1e6d/packages/cache-manager/src/defs/index.ts#L168)*

## Methods

###  analyzeQuery

▸ **analyzeQuery**(`requestData`: RequestData, `options`: RequestOptions, `context`: RequestContext): *Promise‹[AnalyzeQueryResult](analyzequeryresult.md)›*

*Defined in [cache-manager/src/defs/index.ts:169](https://github.com/badbatch/graphql-box/blob/3fa1e6d/packages/cache-manager/src/defs/index.ts#L169)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹[AnalyzeQueryResult](analyzequeryresult.md)›*

___

###  cacheQuery

▸ **cacheQuery**(`requestData`: RequestData, `updatedRequestData`: RequestData | undefined, `responseData`: RawResponseDataWithMaybeCacheMetadata, `options`: RequestOptions, `context`: RequestContext): *Promise‹ResponseData›*

*Defined in [cache-manager/src/defs/index.ts:170](https://github.com/badbatch/graphql-box/blob/3fa1e6d/packages/cache-manager/src/defs/index.ts#L170)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`updatedRequestData` | RequestData &#124; undefined |
`responseData` | RawResponseDataWithMaybeCacheMetadata |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹ResponseData›*

___

###  cacheResponse

▸ **cacheResponse**(`requestData`: RequestData, `responseData`: RawResponseDataWithMaybeCacheMetadata, `options`: RequestOptions, `context`: RequestContext): *Promise‹ResponseData›*

*Defined in [cache-manager/src/defs/index.ts:177](https://github.com/badbatch/graphql-box/blob/3fa1e6d/packages/cache-manager/src/defs/index.ts#L177)*

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

*Defined in [cache-manager/src/defs/index.ts:183](https://github.com/badbatch/graphql-box/blob/3fa1e6d/packages/cache-manager/src/defs/index.ts#L183)*

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

*Defined in [cache-manager/src/defs/index.ts:189](https://github.com/badbatch/graphql-box/blob/3fa1e6d/packages/cache-manager/src/defs/index.ts#L189)*

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

*Defined in [cache-manager/src/defs/index.ts:194](https://github.com/badbatch/graphql-box/blob/3fa1e6d/packages/cache-manager/src/defs/index.ts#L194)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string |

**Returns:** *void*

___

###  setQueryResponseCacheEntry

▸ **setQueryResponseCacheEntry**(`requestData`: RequestData, `responseData`: ResponseData, `options`: RequestOptions, `context`: [CacheManagerContext](cachemanagercontext.md)): *Promise‹void›*

*Defined in [cache-manager/src/defs/index.ts:195](https://github.com/badbatch/graphql-box/blob/3fa1e6d/packages/cache-manager/src/defs/index.ts#L195)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`responseData` | ResponseData |
`options` | RequestOptions |
`context` | [CacheManagerContext](cachemanagercontext.md) |

**Returns:** *Promise‹void›*
