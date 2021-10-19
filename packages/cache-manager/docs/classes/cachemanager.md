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

*Defined in [main/index.ts:305](https://github.com/badbatch/graphql-box/blob/25fe942/packages/cache-manager/src/main/index.ts#L305)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[CacheManager](cachemanager.md)*

## Accessors

###  cache

• **get cache**(): *Cachemap*

*Defined in [main/index.ts:316](https://github.com/badbatch/graphql-box/blob/25fe942/packages/cache-manager/src/main/index.ts#L316)*

**Returns:** *Cachemap*

## Methods

###  analyzeQuery

▸ **analyzeQuery**(`requestData`: RequestData, `options`: RequestOptions, `context`: RequestContext): *Promise‹[AnalyzeQueryResult](../interfaces/analyzequeryresult.md)›*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [main/index.ts:320](https://github.com/badbatch/graphql-box/blob/25fe942/packages/cache-manager/src/main/index.ts#L320)*

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

*Defined in [main/index.ts:349](https://github.com/badbatch/graphql-box/blob/25fe942/packages/cache-manager/src/main/index.ts#L349)*

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

*Defined in [main/index.ts:358](https://github.com/badbatch/graphql-box/blob/25fe942/packages/cache-manager/src/main/index.ts#L358)*

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

*Defined in [main/index.ts:375](https://github.com/badbatch/graphql-box/blob/25fe942/packages/cache-manager/src/main/index.ts#L375)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string |

**Returns:** *void*

___

###  resolveQuery

▸ **resolveQuery**(`requestData`: RequestData, `updatedRequestData`: RequestData, `rawResponseData`: RawResponseDataWithMaybeCacheMetadata, `options`: RequestOptions, `context`: RequestContext): *Promise‹ResponseData›*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [main/index.ts:379](https://github.com/badbatch/graphql-box/blob/25fe942/packages/cache-manager/src/main/index.ts#L379)*

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

*Defined in [main/index.ts:416](https://github.com/badbatch/graphql-box/blob/25fe942/packages/cache-manager/src/main/index.ts#L416)*

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

*Defined in [main/index.ts:71](https://github.com/badbatch/graphql-box/blob/25fe942/packages/cache-manager/src/main/index.ts#L71)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../interfaces/initoptions.md) |

**Returns:** *Promise‹[CacheManager](cachemanager.md)›*
