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
* [checkCacheEntry](cachemanager.md#checkcacheentry)
* [checkQueryResponseCacheEntry](cachemanager.md#checkqueryresponsecacheentry)
* [deletePartialQueryResponse](cachemanager.md#deletepartialqueryresponse)
* [resolveQuery](cachemanager.md#resolvequery)
* [resolveRequest](cachemanager.md#resolverequest)
* [init](cachemanager.md#static-init)

## Constructors

###  constructor

\+ **new CacheManager**(`options`: [ConstructorOptions](../interfaces/constructoroptions.md)): *[CacheManager](cachemanager.md)*

*Defined in [cache-manager/src/main/index.ts:229](https://github.com/badbatch/graphql-box/blob/1dcbc7d/packages/cache-manager/src/main/index.ts#L229)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[CacheManager](cachemanager.md)*

## Accessors

###  cache

• **get cache**(): *Cachemap*

*Defined in [cache-manager/src/main/index.ts:240](https://github.com/badbatch/graphql-box/blob/1dcbc7d/packages/cache-manager/src/main/index.ts#L240)*

**Returns:** *Cachemap*

## Methods

###  analyzeQuery

▸ **analyzeQuery**(`requestData`: RequestData, `options`: RequestOptions, `context`: RequestContext): *Promise‹[AnalyzeQueryResult](../interfaces/analyzequeryresult.md)›*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [cache-manager/src/main/index.ts:244](https://github.com/badbatch/graphql-box/blob/1dcbc7d/packages/cache-manager/src/main/index.ts#L244)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹[AnalyzeQueryResult](../interfaces/analyzequeryresult.md)›*

___

###  checkCacheEntry

▸ **checkCacheEntry**(`cacheType`: CacheTypes, `hash`: string, `options`: RequestOptions, `context`: RequestContext): *Promise‹[CheckCacheEntryResult](../interfaces/checkcacheentryresult.md) | false›*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [cache-manager/src/main/index.ts:286](https://github.com/badbatch/graphql-box/blob/1dcbc7d/packages/cache-manager/src/main/index.ts#L286)*

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

*Defined in [cache-manager/src/main/index.ts:295](https://github.com/badbatch/graphql-box/blob/1dcbc7d/packages/cache-manager/src/main/index.ts#L295)*

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

*Defined in [cache-manager/src/main/index.ts:314](https://github.com/badbatch/graphql-box/blob/1dcbc7d/packages/cache-manager/src/main/index.ts#L314)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string |

**Returns:** *void*

___

###  resolveQuery

▸ **resolveQuery**(`requestData`: RequestData, `updatedRequestData`: RequestData, `rawResponseData`: RawResponseDataWithMaybeCacheMetadata, `options`: RequestOptions, `context`: RequestContext): *Promise‹ResponseData›*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [cache-manager/src/main/index.ts:318](https://github.com/badbatch/graphql-box/blob/1dcbc7d/packages/cache-manager/src/main/index.ts#L318)*

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

###  resolveRequest

▸ **resolveRequest**(`requestData`: RequestData, `rawResponseData`: RawResponseDataWithMaybeCacheMetadata, `options`: RequestOptions, `context`: RequestContext): *Promise‹ResponseData›*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [cache-manager/src/main/index.ts:380](https://github.com/badbatch/graphql-box/blob/1dcbc7d/packages/cache-manager/src/main/index.ts#L380)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | RequestData |
`rawResponseData` | RawResponseDataWithMaybeCacheMetadata |
`options` | RequestOptions |
`context` | RequestContext |

**Returns:** *Promise‹ResponseData›*

___

### `Static` init

▸ **init**(`options`: [InitOptions](../interfaces/initoptions.md)): *Promise‹[CacheManager](cachemanager.md)›*

*Defined in [cache-manager/src/main/index.ts:70](https://github.com/badbatch/graphql-box/blob/1dcbc7d/packages/cache-manager/src/main/index.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../interfaces/initoptions.md) |

**Returns:** *Promise‹[CacheManager](cachemanager.md)›*
