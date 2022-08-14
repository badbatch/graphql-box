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

## Constructors

###  constructor

\+ **new CacheManager**(`options`: [ConstructorOptions](../interfaces/constructoroptions.md)): *[CacheManager](cachemanager.md)*

*Defined in [cache-manager/src/main/index.ts:214](https://github.com/badbatch/graphql-box/blob/7e0d83b/packages/cache-manager/src/main/index.ts#L214)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[CacheManager](cachemanager.md)*

## Accessors

###  cache

• **get cache**(): *Cachemap*

*Defined in [cache-manager/src/main/index.ts:239](https://github.com/badbatch/graphql-box/blob/7e0d83b/packages/cache-manager/src/main/index.ts#L239)*

**Returns:** *Cachemap*

## Methods

###  analyzeQuery

▸ **analyzeQuery**(`requestData`: RequestData, `options`: RequestOptions, `context`: RequestContext): *Promise‹[AnalyzeQueryResult](../interfaces/analyzequeryresult.md)›*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [cache-manager/src/main/index.ts:243](https://github.com/badbatch/graphql-box/blob/7e0d83b/packages/cache-manager/src/main/index.ts#L243)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹[AnalyzeQueryResult](../interfaces/analyzequeryresult.md)›*

___

###  cacheQuery

▸ **cacheQuery**(`requestData`: RequestData, `updatedRequestData`: RequestData, `rawResponseData`: RawResponseDataWithMaybeCacheMetadata, `options`: RequestOptions, `context`: RequestContext): *Promise‹ResponseData›*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [cache-manager/src/main/index.ts:285](https://github.com/badbatch/graphql-box/blob/7e0d83b/packages/cache-manager/src/main/index.ts#L285)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`updatedRequestData` | RequestData |
`rawResponseData` | RawResponseDataWithMaybeCacheMetadata |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹ResponseData›*

___

###  cacheResponse

▸ **cacheResponse**(`requestData`: RequestData, `rawResponseData`: RawResponseDataWithMaybeCacheMetadata, `options`: RequestOptions, `context`: RequestContext): *Promise‹ResponseData›*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [cache-manager/src/main/index.ts:301](https://github.com/badbatch/graphql-box/blob/7e0d83b/packages/cache-manager/src/main/index.ts#L301)*

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

▸ **checkCacheEntry**(`cacheType`: CacheTypes, `hash`: string, `options`: RequestOptions, `context`: RequestContext): *Promise‹[CheckCacheEntryResult](../interfaces/checkcacheentryresult.md) | false›*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [cache-manager/src/main/index.ts:316](https://github.com/badbatch/graphql-box/blob/7e0d83b/packages/cache-manager/src/main/index.ts#L316)*

**Parameters:**

Name | Type |
------ | ------ |
`cacheType` | CacheTypes |
`hash` | string |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹[CheckCacheEntryResult](../interfaces/checkcacheentryresult.md) | false›*

___

###  checkQueryResponseCacheEntry

▸ **checkQueryResponseCacheEntry**(`hash`: string, `options`: RequestOptions, `context`: RequestContext): *Promise‹ResponseData | false›*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [cache-manager/src/main/index.ts:325](https://github.com/badbatch/graphql-box/blob/7e0d83b/packages/cache-manager/src/main/index.ts#L325)*

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

*Defined in [cache-manager/src/main/index.ts:344](https://github.com/badbatch/graphql-box/blob/7e0d83b/packages/cache-manager/src/main/index.ts#L344)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string |

**Returns:** *void*
