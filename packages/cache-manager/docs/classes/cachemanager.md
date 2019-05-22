[Documentation](../README.md) > [CacheManager](../classes/cachemanager.md)

# Class: CacheManager

## Hierarchy

**CacheManager**

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
* [init](cachemanager.md#init)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new CacheManager**(options: *[ConstructorOptions](../interfaces/constructoroptions.md)*): [CacheManager](cachemanager.md)

*Defined in [main/index.ts:315](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/main/index.ts#L315)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** [CacheManager](cachemanager.md)

___

## Accessors

<a id="cache"></a>

###  cache

**get cache**(): `Cachemap`

*Defined in [main/index.ts:326](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/main/index.ts#L326)*

**Returns:** `Cachemap`

___

## Methods

<a id="analyzequery"></a>

###  analyzeQuery

▸ **analyzeQuery**(requestData: *`RequestData`*, options: *`RequestOptions`*, context: *`RequestContext`*): `Promise`<[AnalyzeQueryResult](../interfaces/analyzequeryresult.md)>

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md).[analyzeQuery](../interfaces/cachemanagerdef.md#analyzequery)*

*Defined in [main/index.ts:330](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/main/index.ts#L330)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| requestData | `RequestData` |
| options | `RequestOptions` |
| context | `RequestContext` |

**Returns:** `Promise`<[AnalyzeQueryResult](../interfaces/analyzequeryresult.md)>

___
<a id="checkcacheentry"></a>

###  checkCacheEntry

▸ **checkCacheEntry**(cacheType: *`CacheTypes`*, hash: *`string`*, options: *`RequestOptions`*, context: *`RequestContext`*): `Promise`<[CheckCacheEntryResult](../interfaces/checkcacheentryresult.md) \| `false`>

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md).[checkCacheEntry](../interfaces/cachemanagerdef.md#checkcacheentry)*

*Defined in [main/index.ts:359](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/main/index.ts#L359)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| cacheType | `CacheTypes` |
| hash | `string` |
| options | `RequestOptions` |
| context | `RequestContext` |

**Returns:** `Promise`<[CheckCacheEntryResult](../interfaces/checkcacheentryresult.md) \| `false`>

___
<a id="checkqueryresponsecacheentry"></a>

###  checkQueryResponseCacheEntry

▸ **checkQueryResponseCacheEntry**(hash: *`string`*, options: *`RequestOptions`*, context: *`RequestContext`*): `Promise`<`ResponseData` \| `false`>

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md).[checkQueryResponseCacheEntry](../interfaces/cachemanagerdef.md#checkqueryresponsecacheentry)*

*Defined in [main/index.ts:368](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/main/index.ts#L368)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| hash | `string` |
| options | `RequestOptions` |
| context | `RequestContext` |

**Returns:** `Promise`<`ResponseData` \| `false`>

___
<a id="deletepartialqueryresponse"></a>

###  deletePartialQueryResponse

▸ **deletePartialQueryResponse**(hash: *`string`*): `void`

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md).[deletePartialQueryResponse](../interfaces/cachemanagerdef.md#deletepartialqueryresponse)*

*Defined in [main/index.ts:385](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/main/index.ts#L385)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| hash | `string` |

**Returns:** `void`

___
<a id="resolvequery"></a>

###  resolveQuery

▸ **resolveQuery**(requestData: *`RequestData`*, updatedRequestData: *`RequestData`*, rawResponseData: *`RawResponseDataWithMaybeCacheMetadata`*, options: *`RequestOptions`*, context: *`RequestContext`*): `Promise`<`ResponseData`>

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md).[resolveQuery](../interfaces/cachemanagerdef.md#resolvequery)*

*Defined in [main/index.ts:389](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/main/index.ts#L389)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| requestData | `RequestData` |
| updatedRequestData | `RequestData` |
| rawResponseData | `RawResponseDataWithMaybeCacheMetadata` |
| options | `RequestOptions` |
| context | `RequestContext` |

**Returns:** `Promise`<`ResponseData`>

___
<a id="resolverequest"></a>

###  resolveRequest

▸ **resolveRequest**(requestData: *`RequestData`*, rawResponseData: *`RawResponseDataWithMaybeCacheMetadata`*, options: *`RequestOptions`*, context: *`RequestContext`*): `Promise`<`ResponseData`>

*Implementation of [CacheManagerDef](../interfaces/cachemanagerdef.md).[resolveRequest](../interfaces/cachemanagerdef.md#resolverequest)*

*Defined in [main/index.ts:427](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/main/index.ts#L427)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| requestData | `RequestData` |
| rawResponseData | `RawResponseDataWithMaybeCacheMetadata` |
| options | `RequestOptions` |
| context | `RequestContext` |

**Returns:** `Promise`<`ResponseData`>

___
<a id="init"></a>

### `<Static>` init

▸ **init**(options: *[InitOptions](../interfaces/initoptions.md)*): `Promise`<[CacheManager](cachemanager.md)>

*Defined in [main/index.ts:77](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/main/index.ts#L77)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [InitOptions](../interfaces/initoptions.md) |

**Returns:** `Promise`<[CacheManager](cachemanager.md)>

___

