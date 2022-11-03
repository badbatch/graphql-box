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

*Defined in [cache-manager/src/defs/index.ts:163](https://github.com/badbatch/graphql-box/blob/7c48d653/packages/cache-manager/src/defs/index.ts#L163)*

## Methods

###  analyzeQuery

▸ **analyzeQuery**(`requestData`: RequestData, `options`: RequestOptions, `context`: RequestContext): *Promise‹[AnalyzeQueryResult](analyzequeryresult.md)›*

*Defined in [cache-manager/src/defs/index.ts:164](https://github.com/badbatch/graphql-box/blob/7c48d653/packages/cache-manager/src/defs/index.ts#L164)*

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

*Defined in [cache-manager/src/defs/index.ts:165](https://github.com/badbatch/graphql-box/blob/7c48d653/packages/cache-manager/src/defs/index.ts#L165)*

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

*Defined in [cache-manager/src/defs/index.ts:172](https://github.com/badbatch/graphql-box/blob/7c48d653/packages/cache-manager/src/defs/index.ts#L172)*

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

*Defined in [cache-manager/src/defs/index.ts:178](https://github.com/badbatch/graphql-box/blob/7c48d653/packages/cache-manager/src/defs/index.ts#L178)*

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

*Defined in [cache-manager/src/defs/index.ts:184](https://github.com/badbatch/graphql-box/blob/7c48d653/packages/cache-manager/src/defs/index.ts#L184)*

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

*Defined in [cache-manager/src/defs/index.ts:189](https://github.com/badbatch/graphql-box/blob/7c48d653/packages/cache-manager/src/defs/index.ts#L189)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string |

**Returns:** *void*

___

###  setQueryResponseCacheEntry

▸ **setQueryResponseCacheEntry**(`requestData`: RequestData, `responseData`: ResponseData, `options`: RequestOptions, `context`: [CacheManagerContext](cachemanagercontext.md)): *Promise‹void›*

*Defined in [cache-manager/src/defs/index.ts:190](https://github.com/badbatch/graphql-box/blob/7c48d653/packages/cache-manager/src/defs/index.ts#L190)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`responseData` | ResponseData |
`options` | RequestOptions |
`context` | [CacheManagerContext](cachemanagercontext.md) |

**Returns:** *Promise‹void›*
