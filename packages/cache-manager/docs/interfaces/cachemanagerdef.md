[Documentation](../README.md) > [CacheManagerDef](../interfaces/cachemanagerdef.md)

# Interface: CacheManagerDef

## Hierarchy

**CacheManagerDef**

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

---

## Properties

<a id="cache"></a>

###  cache

**● cache**: *`Cachemap`*

*Defined in [defs/index.ts:182](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/defs/index.ts#L182)*

___

## Methods

<a id="analyzequery"></a>

###  analyzeQuery

▸ **analyzeQuery**(requestData: *`RequestData`*, options: *`RequestOptions`*, context: *`RequestContext`*): `Promise`<[AnalyzeQueryResult](analyzequeryresult.md)>

*Defined in [defs/index.ts:183](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/defs/index.ts#L183)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| requestData | `RequestData` |
| options | `RequestOptions` |
| context | `RequestContext` |

**Returns:** `Promise`<[AnalyzeQueryResult](analyzequeryresult.md)>

___
<a id="checkcacheentry"></a>

###  checkCacheEntry

▸ **checkCacheEntry**(cacheType: *`CacheTypes`*, hash: *`string`*, options: *`RequestOptions`*, context: *`RequestContext`*): `Promise`<[CheckCacheEntryResult](checkcacheentryresult.md) \| `false`>

*Defined in [defs/index.ts:188](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/defs/index.ts#L188)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| cacheType | `CacheTypes` |
| hash | `string` |
| options | `RequestOptions` |
| context | `RequestContext` |

**Returns:** `Promise`<[CheckCacheEntryResult](checkcacheentryresult.md) \| `false`>

___
<a id="checkqueryresponsecacheentry"></a>

###  checkQueryResponseCacheEntry

▸ **checkQueryResponseCacheEntry**(hash: *`string`*, options: *`RequestOptions`*, context: *`RequestContext`*): `Promise`<`ResponseData` \| `false`>

*Defined in [defs/index.ts:194](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/defs/index.ts#L194)*

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

*Defined in [defs/index.ts:199](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/defs/index.ts#L199)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| hash | `string` |

**Returns:** `void`

___
<a id="resolvequery"></a>

###  resolveQuery

▸ **resolveQuery**(requestData: *`RequestData`*, updatedRequestData: *`RequestData`*, responseData: *`RawResponseDataWithMaybeCacheMetadata`*, options: *`RequestOptions`*, context: *`RequestContext`*): `Promise`<`ResponseData`>

*Defined in [defs/index.ts:202](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/defs/index.ts#L202)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| requestData | `RequestData` |
| updatedRequestData | `RequestData` |
| responseData | `RawResponseDataWithMaybeCacheMetadata` |
| options | `RequestOptions` |
| context | `RequestContext` |

**Returns:** `Promise`<`ResponseData`>

___
<a id="resolverequest"></a>

###  resolveRequest

▸ **resolveRequest**(requestData: *`RequestData`*, responseData: *`RawResponseDataWithMaybeCacheMetadata`*, options: *`RequestOptions`*, context: *`RequestContext`*): `Promise`<`ResponseData`>

*Defined in [defs/index.ts:209](https://github.com/bad-batch/handl/blob/20503ed/packages/cache-manager/src/defs/index.ts#L209)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| requestData | `RequestData` |
| responseData | `RawResponseDataWithMaybeCacheMetadata` |
| options | `RequestOptions` |
| context | `RequestContext` |

**Returns:** `Promise`<`ResponseData`>

___

