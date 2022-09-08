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
* [CheckCacheEntryResult](interfaces/checkcacheentryresult.md)
* [CheckFieldPathChecklistResult](interfaces/checkfieldpathchecklistresult.md)
* [ClientOptions](interfaces/clientoptions.md)
* [ConstructorOptions](interfaces/constructoroptions.md)
* [DataForCachingEntry](interfaces/dataforcachingentry.md)
* [ExportCacheResult](interfaces/exportcacheresult.md)
* [FieldCount](interfaces/fieldcount.md)
* [FieldPathChecklistValue](interfaces/fieldpathchecklistvalue.md)
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
* [HEADER_CACHE_CONTROL](README.md#const-header_cache_control)
* [HEADER_NO_CACHE](README.md#const-header_no_cache)
* [METADATA](README.md#const-metadata)
* [NO_CACHE](README.md#const-no_cache)

### Functions

* [filterField](README.md#const-filterfield)
* [getValidTypeIDValue](README.md#const-getvalidtypeidvalue)
* [init](README.md#init)
* [logCacheEntry](README.md#logcacheentry)
* [logCacheQuery](README.md#logcachequery)
* [logPartialCompiled](README.md#logpartialcompiled)

## Type aliases

###  CacheManagerInit

Ƭ **CacheManagerInit**: *function*

*Defined in [cache-manager/src/defs/index.ts:198](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/defs/index.ts#L198)*

#### Type declaration:

▸ (`options`: [ClientOptions](interfaces/clientoptions.md)): *[CacheManagerDef](interfaces/cachemanagerdef.md)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ClientOptions](interfaces/clientoptions.md) |

___

###  FieldPathChecklist

Ƭ **FieldPathChecklist**: *Map‹string, [FieldPathChecklistValue](interfaces/fieldpathchecklistvalue.md)[]›*

*Defined in [cache-manager/src/defs/index.ts:88](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/defs/index.ts#L88)*

___

###  FragmentSpreadCheckist

Ƭ **FragmentSpreadCheckist**: *object*

*Defined in [cache-manager/src/helpers/createFragmentSpreadChecklist.ts:5](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/helpers/createFragmentSpreadChecklist.ts#L5)*

#### Type declaration:

* \[ **key**: *string*\]: object

* **deleted**: *number*

* **paths**: *string[]*

* **total**: *number*

___

###  FragmentSpreadFieldCounter

Ƭ **FragmentSpreadFieldCounter**: *Record‹string, object›*

*Defined in [cache-manager/src/defs/index.ts:128](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/defs/index.ts#L128)*

___

###  Params

Ƭ **Params**: *object*

*Defined in [cache-manager/src/helpers/deriveOpCacheability.ts:6](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/helpers/deriveOpCacheability.ts#L6)*

#### Type declaration:

* **_cacheMetadata**? : *DehydratedCacheMetadata*

* **fallback**: *string*

* **headers**? : *Headers*

___

###  PartialQueryResponses

Ƭ **PartialQueryResponses**: *Map‹string, [PartialQueryResponse](interfaces/partialqueryresponse.md)›*

*Defined in [cache-manager/src/defs/index.ts:69](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/defs/index.ts#L69)*

## Variables

### `Const` CACHE_CONTROL

• **CACHE_CONTROL**: *"cacheControl"* = "cacheControl"

*Defined in [cache-manager/src/consts/index.ts:2](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/consts/index.ts#L2)*

___

### `Const` HEADER_CACHE_CONTROL

• **HEADER_CACHE_CONTROL**: *"cache-control"* = "cache-control"

*Defined in [cache-manager/src/consts/index.ts:5](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/consts/index.ts#L5)*

___

### `Const` HEADER_NO_CACHE

• **HEADER_NO_CACHE**: *"no-cache"* = "no-cache"

*Defined in [cache-manager/src/consts/index.ts:6](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/consts/index.ts#L6)*

___

### `Const` METADATA

• **METADATA**: *"metadata"* = "metadata"

*Defined in [cache-manager/src/consts/index.ts:1](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/consts/index.ts#L1)*

___

### `Const` NO_CACHE

• **NO_CACHE**: *"noCache"* = "noCache"

*Defined in [cache-manager/src/consts/index.ts:3](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/consts/index.ts#L3)*

## Functions

### `Const` filterField

▸ **filterField**(`field`: FieldNode | FragmentDefinitionNode | OperationDefinitionNode, `fieldPathChecklist`: [FieldPathChecklist](README.md#fieldpathchecklist), `fragmentSpreadChecklist`: [FragmentSpreadCheckist](README.md#fragmentspreadcheckist), `ancestorRequestFieldPath`: string, `context`: [CacheManagerContext](interfaces/cachemanagercontext.md)): *boolean*

*Defined in [cache-manager/src/helpers/filterField.ts:18](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/helpers/filterField.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`field` | FieldNode &#124; FragmentDefinitionNode &#124; OperationDefinitionNode |
`fieldPathChecklist` | [FieldPathChecklist](README.md#fieldpathchecklist) |
`fragmentSpreadChecklist` | [FragmentSpreadCheckist](README.md#fragmentspreadcheckist) |
`ancestorRequestFieldPath` | string |
`context` | [CacheManagerContext](interfaces/cachemanagercontext.md) |

**Returns:** *boolean*

___

### `Const` getValidTypeIDValue

▸ **getValidTypeIDValue**(`requestFieldPathData`: any, `__namedParameters`: object, `typeIDKey`: string): *string | number | undefined*

*Defined in [cache-manager/src/helpers/validTypeIDValue.ts:4](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/helpers/validTypeIDValue.ts#L4)*

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

*Defined in [cache-manager/src/main/index.ts:1183](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/main/index.ts#L1183)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *[CacheManagerInit](README.md#cachemanagerinit)*

___

###  logCacheEntry

▸ **logCacheEntry**(): *(Anonymous function)*

*Defined in [cache-manager/src/debug/log-cache-entry/index.ts:3](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/debug/log-cache-entry/index.ts#L3)*

**Returns:** *(Anonymous function)*

___

###  logCacheQuery

▸ **logCacheQuery**(): *(Anonymous function)*

*Defined in [cache-manager/src/debug/log-cache-query/index.ts:3](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/debug/log-cache-query/index.ts#L3)*

**Returns:** *(Anonymous function)*

___

###  logPartialCompiled

▸ **logPartialCompiled**(): *(Anonymous function)*

*Defined in [cache-manager/src/debug/log-partial-compiled/index.ts:3](https://github.com/badbatch/graphql-box/blob/0289bea5/packages/cache-manager/src/debug/log-partial-compiled/index.ts#L3)*

**Returns:** *(Anonymous function)*
