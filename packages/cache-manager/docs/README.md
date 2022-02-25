[Documentation](README.md)

# Documentation

## Index

### Classes

* [CacheManager](classes/cachemanager.md)

### Interfaces

* [AnalyzeQueryResult](interfaces/analyzequeryresult.md)
* [AncestorKeysAndPaths](interfaces/ancestorkeysandpaths.md)
* [CacheManagerContext](interfaces/cachemanagercontext.md)
* [CacheManagerDef](interfaces/cachemanagerdef.md)
* [CachedAncestorFieldData](interfaces/cachedancestorfielddata.md)
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
* [TypeNamesAndKind](interfaces/typenamesandkind.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [CacheManagerInit](README.md#cachemanagerinit)
* [FieldPathChecklist](README.md#fieldpathchecklist)
* [FragmentSpreadCheckist](README.md#fragmentspreadcheckist)
* [FragmentSpreadFieldCounter](README.md#fragmentspreadfieldcounter)
* [Params](README.md#params)
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

* [buildFieldKeysAndPaths](README.md#const-buildfieldkeysandpaths)
* [buildKey](README.md#const-buildkey)
* [buildRequestFieldCacheKey](README.md#const-buildrequestfieldcachekey)
* [filterField](README.md#const-filterfield)
* [getValidTypeIDValue](README.md#const-getvalidtypeidvalue)
* [init](README.md#init)
* [logCacheEntry](README.md#logcacheentry)
* [logCacheQuery](README.md#logcachequery)
* [logPartialCompiled](README.md#logpartialcompiled)

## Type aliases

###  CacheManagerInit

Ƭ **CacheManagerInit**: *function*

*Defined in [cache-manager/src/defs/index.ts:219](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/defs/index.ts#L219)*

#### Type declaration:

▸ (`options`: [ClientOptions](interfaces/clientoptions.md)): *Promise‹[CacheManagerDef](interfaces/cachemanagerdef.md)›*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ClientOptions](interfaces/clientoptions.md) |

___

###  FieldPathChecklist

Ƭ **FieldPathChecklist**: *Map‹string, [FieldPathChecklistValue](interfaces/fieldpathchecklistvalue.md)[]›*

*Defined in [cache-manager/src/defs/index.ts:95](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/defs/index.ts#L95)*

___

###  FragmentSpreadCheckist

Ƭ **FragmentSpreadCheckist**: *object*

*Defined in [cache-manager/src/helpers/createFragmentSpreadChecklist.ts:5](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/helpers/createFragmentSpreadChecklist.ts#L5)*

#### Type declaration:

* \[ **key**: *string*\]: object

* **deleted**: *number*

* **paths**: *string[]*

* **total**: *number*

___

###  FragmentSpreadFieldCounter

Ƭ **FragmentSpreadFieldCounter**: *Record‹string, object›*

*Defined in [cache-manager/src/defs/index.ts:150](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/defs/index.ts#L150)*

___

###  Params

Ƭ **Params**: *object*

*Defined in [cache-manager/src/helpers/deriveOpCacheability.ts:6](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/helpers/deriveOpCacheability.ts#L6)*

#### Type declaration:

* **_cacheMetadata**? : *DehydratedCacheMetadata*

* **fallback**: *string*

* **headers**? : *Headers*

___

###  PartialQueryResponses

Ƭ **PartialQueryResponses**: *Map‹string, [PartialQueryResponse](interfaces/partialqueryresponse.md)›*

*Defined in [cache-manager/src/defs/index.ts:76](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/defs/index.ts#L76)*

## Variables

### `Const` CACHE_CONTROL

• **CACHE_CONTROL**: *"cacheControl"* = "cacheControl"

*Defined in [cache-manager/src/consts/index.ts:2](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/consts/index.ts#L2)*

___

### `Const` CACHE_ENTRY_ADDED

• **CACHE_ENTRY_ADDED**: *"cache_entry_added"* = "cache_entry_added"

*Defined in [cache-manager/src/consts/index.ts:8](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/consts/index.ts#L8)*

___

### `Const` CACHE_ENTRY_QUERIED

• **CACHE_ENTRY_QUERIED**: *"cache_entry_queried"* = "cache_entry_queried"

*Defined in [cache-manager/src/consts/index.ts:9](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/consts/index.ts#L9)*

___

### `Const` HEADER_CACHE_CONTROL

• **HEADER_CACHE_CONTROL**: *"cache-control"* = "cache-control"

*Defined in [cache-manager/src/consts/index.ts:5](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/consts/index.ts#L5)*

___

### `Const` HEADER_NO_CACHE

• **HEADER_NO_CACHE**: *"no-cache"* = "no-cache"

*Defined in [cache-manager/src/consts/index.ts:6](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/consts/index.ts#L6)*

___

### `Const` METADATA

• **METADATA**: *"metadata"* = "metadata"

*Defined in [cache-manager/src/consts/index.ts:1](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/consts/index.ts#L1)*

___

### `Const` NO_CACHE

• **NO_CACHE**: *"noCache"* = "noCache"

*Defined in [cache-manager/src/consts/index.ts:3](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/consts/index.ts#L3)*

___

### `Const` PARTIAL_QUERY_COMPILED

• **PARTIAL_QUERY_COMPILED**: *"partial_query_compiled"* = "partial_query_compiled"

*Defined in [cache-manager/src/consts/index.ts:10](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/consts/index.ts#L10)*

## Functions

### `Const` buildFieldKeysAndPaths

▸ **buildFieldKeysAndPaths**(`field`: FieldNode, `options`: [KeysAndPathsOptions](interfaces/keysandpathsoptions.md), `context`: [CacheManagerContext](interfaces/cachemanagercontext.md)): *[KeysAndPaths](interfaces/keysandpaths.md)*

*Defined in [cache-manager/src/helpers/buildKeysAndPaths.ts:42](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/helpers/buildKeysAndPaths.ts#L42)*

**Parameters:**

Name | Type |
------ | ------ |
`field` | FieldNode |
`options` | [KeysAndPathsOptions](interfaces/keysandpathsoptions.md) |
`context` | [CacheManagerContext](interfaces/cachemanagercontext.md) |

**Returns:** *[KeysAndPaths](interfaces/keysandpaths.md)*

___

### `Const` buildKey

▸ **buildKey**(`path`: string, `key`: string | number): *string*

*Defined in [cache-manager/src/helpers/buildKeysAndPaths.ts:7](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/helpers/buildKeysAndPaths.ts#L7)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |
`key` | string &#124; number |

**Returns:** *string*

___

### `Const` buildRequestFieldCacheKey

▸ **buildRequestFieldCacheKey**(`name`: string, `requestFieldCacheKey`: string, `args`: PlainObjectMap | undefined, `directives?`: FieldTypeInfo["directives"], `index?`: undefined | number): *string*

*Defined in [cache-manager/src/helpers/buildKeysAndPaths.ts:18](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/helpers/buildKeysAndPaths.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`requestFieldCacheKey` | string |
`args` | PlainObjectMap &#124; undefined |
`directives?` | FieldTypeInfo["directives"] |
`index?` | undefined &#124; number |

**Returns:** *string*

___

### `Const` filterField

▸ **filterField**(`field`: FieldNode | FragmentDefinitionNode, `fieldPathChecklist`: [FieldPathChecklist](README.md#fieldpathchecklist), `fragmentSpreadChecklist`: [FragmentSpreadCheckist](README.md#fragmentspreadcheckist), `ancestorRequestFieldPath`: string, `context`: [CacheManagerContext](interfaces/cachemanagercontext.md)): *boolean*

*Defined in [cache-manager/src/helpers/filterField.ts:12](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/helpers/filterField.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`field` | FieldNode &#124; FragmentDefinitionNode |
`fieldPathChecklist` | [FieldPathChecklist](README.md#fieldpathchecklist) |
`fragmentSpreadChecklist` | [FragmentSpreadCheckist](README.md#fragmentspreadcheckist) |
`ancestorRequestFieldPath` | string |
`context` | [CacheManagerContext](interfaces/cachemanagercontext.md) |

**Returns:** *boolean*

___

### `Const` getValidTypeIDValue

▸ **getValidTypeIDValue**(`requestFieldPathData`: any, `__namedParameters`: object, `typeIDKey`: string): *string | number | undefined*

*Defined in [cache-manager/src/helpers/validTypeIDValue.ts:4](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/helpers/validTypeIDValue.ts#L4)*

**Parameters:**

▪ **requestFieldPathData**: *any*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`typeIDValue` | undefined &#124; string &#124; number |

▪ **typeIDKey**: *string*

**Returns:** *string | number | undefined*

___

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *[CacheManagerInit](README.md#cachemanagerinit)*

*Defined in [cache-manager/src/main/index.ts:1129](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/main/index.ts#L1129)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *[CacheManagerInit](README.md#cachemanagerinit)*

___

###  logCacheEntry

▸ **logCacheEntry**(): *(Anonymous function)*

*Defined in [cache-manager/src/debug/log-cache-entry/index.ts:4](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/debug/log-cache-entry/index.ts#L4)*

**Returns:** *(Anonymous function)*

___

###  logCacheQuery

▸ **logCacheQuery**(): *(Anonymous function)*

*Defined in [cache-manager/src/debug/log-cache-query/index.ts:4](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/debug/log-cache-query/index.ts#L4)*

**Returns:** *(Anonymous function)*

___

###  logPartialCompiled

▸ **logPartialCompiled**(): *(Anonymous function)*

*Defined in [cache-manager/src/debug/log-partial-compiled/index.ts:4](https://github.com/badbatch/graphql-box/blob/27a200e/packages/cache-manager/src/debug/log-partial-compiled/index.ts#L4)*

**Returns:** *(Anonymous function)*
