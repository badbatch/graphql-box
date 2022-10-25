[Documentation](../README.md) › [CacheManagerContext](cachemanagercontext.md)

# Interface: CacheManagerContext

## Hierarchy

* RequestContext

  ↳ **CacheManagerContext**

## Index

### Properties

* [debugManager](cachemanagercontext.md#debugmanager)
* [fieldTypeMap](cachemanagercontext.md#fieldtypemap)
* [fragmentDefinitions](cachemanagercontext.md#optional-fragmentdefinitions)
* [hasDeferOrStream](cachemanagercontext.md#optional-hasdeferorstream)
* [normalizePatchResponseData](cachemanagercontext.md#optional-normalizepatchresponsedata)
* [operation](cachemanagercontext.md#operation)
* [operationName](cachemanagercontext.md#operationname)
* [queryFiltered](cachemanagercontext.md#queryfiltered)
* [request](cachemanagercontext.md#request)
* [requestID](cachemanagercontext.md#requestid)
* [typeIDKey](cachemanagercontext.md#optional-typeidkey)
* [whitelistHash](cachemanagercontext.md#whitelisthash)

## Properties

###  debugManager

• **debugManager**: *DebugManagerDef | null*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[debugManager](cachemanagercontext.md#debugmanager)*

Defined in core/lib/types/defs/index.d.ts:160

___

###  fieldTypeMap

• **fieldTypeMap**: *FieldTypeMap*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[fieldTypeMap](cachemanagercontext.md#fieldtypemap)*

Defined in core/lib/types/defs/index.d.ts:161

___

### `Optional` fragmentDefinitions

• **fragmentDefinitions**? : *FragmentDefinitionNodeMap*

*Defined in [cache-manager/src/defs/index.ts:60](https://github.com/badbatch/graphql-box/blob/c1bd2514/packages/cache-manager/src/defs/index.ts#L60)*

___

### `Optional` hasDeferOrStream

• **hasDeferOrStream**? : *undefined | false | true*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[hasDeferOrStream](cachemanagercontext.md#optional-hasdeferorstream)*

Defined in core/lib/types/defs/index.d.ts:162

___

### `Optional` normalizePatchResponseData

• **normalizePatchResponseData**? : *undefined | false | true*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[normalizePatchResponseData](cachemanagercontext.md#optional-normalizepatchresponsedata)*

Defined in core/lib/types/defs/index.d.ts:163

___

###  operation

• **operation**: *ValidOperations*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[operation](cachemanagercontext.md#operation)*

Defined in core/lib/types/defs/index.d.ts:164

___

###  operationName

• **operationName**: *string*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[operationName](cachemanagercontext.md#operationname)*

Defined in core/lib/types/defs/index.d.ts:165

___

###  queryFiltered

• **queryFiltered**: *boolean*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[queryFiltered](cachemanagercontext.md#queryfiltered)*

Defined in core/lib/types/defs/index.d.ts:166

___

###  request

• **request**: *string*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[request](cachemanagercontext.md#request)*

Defined in core/lib/types/defs/index.d.ts:167

___

###  requestID

• **requestID**: *string*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[requestID](cachemanagercontext.md#requestid)*

Defined in core/lib/types/defs/index.d.ts:168

___

### `Optional` typeIDKey

• **typeIDKey**? : *undefined | string*

*Defined in [cache-manager/src/defs/index.ts:61](https://github.com/badbatch/graphql-box/blob/c1bd2514/packages/cache-manager/src/defs/index.ts#L61)*

___

###  whitelistHash

• **whitelistHash**: *string*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[whitelistHash](cachemanagercontext.md#whitelisthash)*

Defined in core/lib/types/defs/index.d.ts:169
