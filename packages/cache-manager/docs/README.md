[Documentation](README.md)

# Documentation

## Index

### Classes

* [CacheManager](classes/cachemanager.md)

### Interfaces

* [AnalyzeQueryResult](interfaces/analyzequeryresult.md)
* [AncestorKeysAndPaths](interfaces/ancestorkeysandpaths.md)
* [CacheManagerDef](interfaces/cachemanagerdef.md)
* [CachedAncestorFieldData](interfaces/cachedancestorfielddata.md)
* [CachedFieldData](interfaces/cachedfielddata.md)
* [CachedResponseData](interfaces/cachedresponsedata.md)
* [CachemapOptions](interfaces/cachemapoptions.md)
* [CheckCacheEntryResult](interfaces/checkcacheentryresult.md)
* [CheckFieldPathChecklistResult](interfaces/checkfieldpathchecklistresult.md)
* [ClientOptions](interfaces/clientoptions.md)
* [ConstructorOptions](interfaces/constructoroptions.md)
* [DataForCachingEntry](interfaces/dataforcachingentry.md)
* [ExportCacheResult](interfaces/exportcacheresult.md)
* [FieldCount](interfaces/fieldcount.md)
* [FieldPathChecklistValue](interfaces/fieldpathchecklistvalue.md)
* [InitOptions](interfaces/initoptions.md)
* [KeysAndPaths](interfaces/keysandpaths.md)
* [KeysAndPathsOptions](interfaces/keysandpathsoptions.md)
* [MergedCachedFieldData](interfaces/mergedcachedfielddata.md)
* [PartialQueryResponse](interfaces/partialqueryresponse.md)
* [QueryResponseCacheEntry](interfaces/queryresponsecacheentry.md)
* [ResponseDataForCaching](interfaces/responsedataforcaching.md)
* [TypeNames](interfaces/typenames.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [CacheManagerInit](README.md#cachemanagerinit)
* [FieldPathChecklist](README.md#fieldpathchecklist)
* [PartialQueryResponses](README.md#partialqueryresponses)

### Variables

* [CACHE_CONTROL](README.md#const-cache_control)
* [CACHE_ENTRY_ADDED](README.md#const-cache_entry_added)
* [CACHE_ENTRY_QUERIED](README.md#const-cache_entry_queried)
* [HEADER_CACHE_CONTROL](README.md#const-header_cache_control)
* [HEADER_NO_CACHE](README.md#const-header_no_cache)
* [METADATA](README.md#const-metadata)
* [NO_CACHE](README.md#const-no_cache)
* [PARTIAL_QUERY_COMPILED](README.md#const-partial_query_compiled)

### Functions

* [init](README.md#init)
* [logCacheEntry](README.md#logcacheentry)
* [logCacheQuery](README.md#logcachequery)
* [logPartialCompiled](README.md#logpartialcompiled)

## Type aliases

###  CacheManagerInit

Ƭ **CacheManagerInit**: *function*

*Defined in [defs/index.ts:211](https://github.com/badbatch/graphql-box/blob/3b7b4f2/packages/cache-manager/src/defs/index.ts#L211)*

#### Type declaration:

▸ (`options`: [ClientOptions](interfaces/clientoptions.md)): *Promise‹[CacheManagerDef](interfaces/cachemanagerdef.md)›*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ClientOptions](interfaces/clientoptions.md) |

___

###  FieldPathChecklist

Ƭ **FieldPathChecklist**: *Map‹string, [FieldPathChecklistValue](interfaces/fieldpathchecklistvalue.md)[]›*

*Defined in [defs/index.ts:87](https://github.com/badbatch/graphql-box/blob/3b7b4f2/packages/cache-manager/src/defs/index.ts#L87)*

___

###  PartialQueryResponses

Ƭ **PartialQueryResponses**: *Map‹string, [PartialQueryResponse](interfaces/partialqueryresponse.md)›*

*Defined in [defs/index.ts:70](https://github.com/badbatch/graphql-box/blob/3b7b4f2/packages/cache-manager/src/defs/index.ts#L70)*

## Variables

### `Const` CACHE_CONTROL

• **CACHE_CONTROL**: *"cacheControl"* = "cacheControl"

*Defined in [consts/index.ts:2](https://github.com/badbatch/graphql-box/blob/3b7b4f2/packages/cache-manager/src/consts/index.ts#L2)*

___

### `Const` CACHE_ENTRY_ADDED

• **CACHE_ENTRY_ADDED**: *"cache_entry_added"* = "cache_entry_added"

*Defined in [consts/index.ts:8](https://github.com/badbatch/graphql-box/blob/3b7b4f2/packages/cache-manager/src/consts/index.ts#L8)*

___

### `Const` CACHE_ENTRY_QUERIED

• **CACHE_ENTRY_QUERIED**: *"cache_entry_queried"* = "cache_entry_queried"

*Defined in [consts/index.ts:9](https://github.com/badbatch/graphql-box/blob/3b7b4f2/packages/cache-manager/src/consts/index.ts#L9)*

___

### `Const` HEADER_CACHE_CONTROL

• **HEADER_CACHE_CONTROL**: *"cache-control"* = "cache-control"

*Defined in [consts/index.ts:5](https://github.com/badbatch/graphql-box/blob/3b7b4f2/packages/cache-manager/src/consts/index.ts#L5)*

___

### `Const` HEADER_NO_CACHE

• **HEADER_NO_CACHE**: *"no-cache"* = "no-cache"

*Defined in [consts/index.ts:6](https://github.com/badbatch/graphql-box/blob/3b7b4f2/packages/cache-manager/src/consts/index.ts#L6)*

___

### `Const` METADATA

• **METADATA**: *"metadata"* = "metadata"

*Defined in [consts/index.ts:1](https://github.com/badbatch/graphql-box/blob/3b7b4f2/packages/cache-manager/src/consts/index.ts#L1)*

___

### `Const` NO_CACHE

• **NO_CACHE**: *"noCache"* = "noCache"

*Defined in [consts/index.ts:3](https://github.com/badbatch/graphql-box/blob/3b7b4f2/packages/cache-manager/src/consts/index.ts#L3)*

___

### `Const` PARTIAL_QUERY_COMPILED

• **PARTIAL_QUERY_COMPILED**: *"partial_query_compiled"* = "partial_query_compiled"

*Defined in [consts/index.ts:10](https://github.com/badbatch/graphql-box/blob/3b7b4f2/packages/cache-manager/src/consts/index.ts#L10)*

## Functions

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *[CacheManagerInit](README.md#cachemanagerinit)*

*Defined in [main/index.ts:1103](https://github.com/badbatch/graphql-box/blob/3b7b4f2/packages/cache-manager/src/main/index.ts#L1103)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *[CacheManagerInit](README.md#cachemanagerinit)*

___

###  logCacheEntry

▸ **logCacheEntry**(): *(Anonymous function)*

*Defined in [debug/log-cache-entry/index.ts:4](https://github.com/badbatch/graphql-box/blob/3b7b4f2/packages/cache-manager/src/debug/log-cache-entry/index.ts#L4)*

**Returns:** *(Anonymous function)*

___

###  logCacheQuery

▸ **logCacheQuery**(): *(Anonymous function)*

*Defined in [debug/log-cache-query/index.ts:4](https://github.com/badbatch/graphql-box/blob/3b7b4f2/packages/cache-manager/src/debug/log-cache-query/index.ts#L4)*

**Returns:** *(Anonymous function)*

___

###  logPartialCompiled

▸ **logPartialCompiled**(): *(Anonymous function)*

*Defined in [debug/log-partial-compiled/index.ts:4](https://github.com/badbatch/graphql-box/blob/3b7b4f2/packages/cache-manager/src/debug/log-partial-compiled/index.ts#L4)*

**Returns:** *(Anonymous function)*
