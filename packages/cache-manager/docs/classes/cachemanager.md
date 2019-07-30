> **[Documentation](../README.md)**

[CacheManager](cachemanager.md) /

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

*Defined in [main/index.ts:316](https://github.com/badbatch/graphql-box/blob/22b398c/packages/cache-manager/src/main/index.ts#L316)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[CacheManager](cachemanager.md)*

## Accessors

###  cache

• **get cache**(): *`Cachemap`*

*Defined in [main/index.ts:327](https://github.com/badbatch/graphql-box/blob/22b398c/packages/cache-manager/src/main/index.ts#L327)*

**Returns:** *`Cachemap`*

## Methods

###  analyzeQuery

▸ **analyzeQuery**(`requestData`: `RequestData`, `options`: `RequestOptions`, `context`: `RequestContext`): *`Promise<AnalyzeQueryResult>`*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [main/index.ts:331](https://github.com/badbatch/graphql-box/blob/22b398c/packages/cache-manager/src/main/index.ts#L331)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | `RequestData` |
`options` | `RequestOptions` |
`context` | `RequestContext` |

**Returns:** *`Promise<AnalyzeQueryResult>`*

___

###  checkCacheEntry

▸ **checkCacheEntry**(`cacheType`: `CacheTypes`, `hash`: string, `options`: `RequestOptions`, `context`: `RequestContext`): *`Promise<CheckCacheEntryResult | false>`*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [main/index.ts:360](https://github.com/badbatch/graphql-box/blob/22b398c/packages/cache-manager/src/main/index.ts#L360)*

**Parameters:**

Name | Type |
------ | ------ |
`cacheType` | `CacheTypes` |
`hash` | string |
`options` | `RequestOptions` |
`context` | `RequestContext` |

**Returns:** *`Promise<CheckCacheEntryResult | false>`*

___

###  checkQueryResponseCacheEntry

▸ **checkQueryResponseCacheEntry**(`hash`: string, `options`: `RequestOptions`, `context`: `RequestContext`): *`Promise<ResponseData | false>`*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [main/index.ts:369](https://github.com/badbatch/graphql-box/blob/22b398c/packages/cache-manager/src/main/index.ts#L369)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string |
`options` | `RequestOptions` |
`context` | `RequestContext` |

**Returns:** *`Promise<ResponseData | false>`*

___

###  deletePartialQueryResponse

▸ **deletePartialQueryResponse**(`hash`: string): *void*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [main/index.ts:386](https://github.com/badbatch/graphql-box/blob/22b398c/packages/cache-manager/src/main/index.ts#L386)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string |

**Returns:** *void*

___

###  resolveQuery

▸ **resolveQuery**(`requestData`: `RequestData`, `updatedRequestData`: `RequestData`, `rawResponseData`: `RawResponseDataWithMaybeCacheMetadata`, `options`: `RequestOptions`, `context`: `RequestContext`): *`Promise<ResponseData>`*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [main/index.ts:390](https://github.com/badbatch/graphql-box/blob/22b398c/packages/cache-manager/src/main/index.ts#L390)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | `RequestData` |
`updatedRequestData` | `RequestData` |
`rawResponseData` | `RawResponseDataWithMaybeCacheMetadata` |
`options` | `RequestOptions` |
`context` | `RequestContext` |

**Returns:** *`Promise<ResponseData>`*

___

###  resolveRequest

▸ **resolveRequest**(`requestData`: `RequestData`, `rawResponseData`: `RawResponseDataWithMaybeCacheMetadata`, `options`: `RequestOptions`, `context`: `RequestContext`): *`Promise<ResponseData>`*

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md)*

*Defined in [main/index.ts:428](https://github.com/badbatch/graphql-box/blob/22b398c/packages/cache-manager/src/main/index.ts#L428)*

**Parameters:**

Name | Type |
------ | ------ |
`requestData` | `RequestData` |
`rawResponseData` | `RawResponseDataWithMaybeCacheMetadata` |
`options` | `RequestOptions` |
`context` | `RequestContext` |

**Returns:** *`Promise<ResponseData>`*

___

### `Static` init

▸ **init**(`options`: [InitOptions](../interfaces/initoptions.md)): *`Promise<CacheManager>`*

*Defined in [main/index.ts:77](https://github.com/badbatch/graphql-box/blob/22b398c/packages/cache-manager/src/main/index.ts#L77)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../interfaces/initoptions.md) |

**Returns:** *`Promise<CacheManager>`*