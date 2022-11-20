[Documentation](../README.md) › [CacheManagerContext](cachemanagercontext.md)

# Interface: CacheManagerContext

## Hierarchy

* RequestContext

  ↳ **CacheManagerContext**

## Index

### Properties

* [debugManager](cachemanagercontext.md#debugmanager)
* [fieldTypeMap](cachemanagercontext.md#fieldtypemap)
* [filteredRequest](cachemanagercontext.md#filteredrequest)
* [fragmentDefinitions](cachemanagercontext.md#optional-fragmentdefinitions)
* [hasDeferOrStream](cachemanagercontext.md#optional-hasdeferorstream)
* [normalizePatchResponseData](cachemanagercontext.md#optional-normalizepatchresponsedata)
* [operation](cachemanagercontext.md#operation)
* [operationName](cachemanagercontext.md#operationname)
* [parsedRequest](cachemanagercontext.md#parsedrequest)
* [queryFiltered](cachemanagercontext.md#queryfiltered)
* [request](cachemanagercontext.md#request)
* [requestComplexity](cachemanagercontext.md#requestcomplexity)
* [requestDepth](cachemanagercontext.md#requestdepth)
* [requestID](cachemanagercontext.md#requestid)
* [typeIDKey](cachemanagercontext.md#optional-typeidkey)
* [whitelistHash](cachemanagercontext.md#whitelisthash)

## Properties

###  debugManager

• **debugManager**: *DebugManagerDef | null*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[debugManager](cachemanagercontext.md#debugmanager)*

Defined in core/lib/types/defs/index.d.ts:205

___

###  fieldTypeMap

• **fieldTypeMap**: *FieldTypeMap*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[fieldTypeMap](cachemanagercontext.md#fieldtypemap)*

Defined in core/lib/types/defs/index.d.ts:206

___

###  filteredRequest

• **filteredRequest**: *string*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[filteredRequest](cachemanagercontext.md#filteredrequest)*

Defined in core/lib/types/defs/index.d.ts:207

___

### `Optional` fragmentDefinitions

• **fragmentDefinitions**? : *FragmentDefinitionNodeMap*

*Defined in [cache-manager/src/defs/index.ts:54](https://github.com/badbatch/graphql-box/blob/3146a3b1/packages/cache-manager/src/defs/index.ts#L54)*

___

### `Optional` hasDeferOrStream

• **hasDeferOrStream**? : *undefined | false | true*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[hasDeferOrStream](cachemanagercontext.md#optional-hasdeferorstream)*

Defined in core/lib/types/defs/index.d.ts:208

___

### `Optional` normalizePatchResponseData

• **normalizePatchResponseData**? : *undefined | false | true*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[normalizePatchResponseData](cachemanagercontext.md#optional-normalizepatchresponsedata)*

Defined in core/lib/types/defs/index.d.ts:209

___

###  operation

• **operation**: *ValidOperations*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[operation](cachemanagercontext.md#operation)*

Defined in core/lib/types/defs/index.d.ts:210

___

###  operationName

• **operationName**: *string*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[operationName](cachemanagercontext.md#operationname)*

Defined in core/lib/types/defs/index.d.ts:211

___

###  parsedRequest

• **parsedRequest**: *string*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[parsedRequest](cachemanagercontext.md#parsedrequest)*

Defined in core/lib/types/defs/index.d.ts:212

___

###  queryFiltered

• **queryFiltered**: *boolean*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[queryFiltered](cachemanagercontext.md#queryfiltered)*

Defined in core/lib/types/defs/index.d.ts:213

___

###  request

• **request**: *string*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[request](cachemanagercontext.md#request)*

Defined in core/lib/types/defs/index.d.ts:214

___

###  requestComplexity

• **requestComplexity**: *number | null*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[requestComplexity](cachemanagercontext.md#requestcomplexity)*

Defined in core/lib/types/defs/index.d.ts:215

___

###  requestDepth

• **requestDepth**: *number | null*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[requestDepth](cachemanagercontext.md#requestdepth)*

Defined in core/lib/types/defs/index.d.ts:216

___

###  requestID

• **requestID**: *string*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[requestID](cachemanagercontext.md#requestid)*

Defined in core/lib/types/defs/index.d.ts:217

___

### `Optional` typeIDKey

• **typeIDKey**? : *undefined | string*

*Defined in [cache-manager/src/defs/index.ts:55](https://github.com/badbatch/graphql-box/blob/3146a3b1/packages/cache-manager/src/defs/index.ts#L55)*

___

###  whitelistHash

• **whitelistHash**: *string*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[whitelistHash](cachemanagercontext.md#whitelisthash)*

Defined in core/lib/types/defs/index.d.ts:218
