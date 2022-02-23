[Documentation](../README.md) › [CacheManagerContext](cachemanagercontext.md)

# Interface: CacheManagerContext

## Hierarchy

* RequestContext

  ↳ **CacheManagerContext**

## Index

### Properties

* [boxID](cachemanagercontext.md#boxid)
* [debugManager](cachemanagercontext.md#debugmanager)
* [fieldTypeMap](cachemanagercontext.md#fieldtypemap)
* [fragmentDefinitions](cachemanagercontext.md#optional-fragmentdefinitions)
* [hasDeferOrStream](cachemanagercontext.md#optional-hasdeferorstream)
* [operation](cachemanagercontext.md#operation)
* [operationName](cachemanagercontext.md#operationname)
* [queryFiltered](cachemanagercontext.md#queryfiltered)
* [request](cachemanagercontext.md#request)
* [typeIDKey](cachemanagercontext.md#optional-typeidkey)

## Properties

###  boxID

• **boxID**: *string*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[boxID](cachemanagercontext.md#boxid)*

Defined in core/lib/types/defs/index.d.ts:119

___

###  debugManager

• **debugManager**: *DebugManagerDef | null*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[debugManager](cachemanagercontext.md#debugmanager)*

Defined in core/lib/types/defs/index.d.ts:120

___

###  fieldTypeMap

• **fieldTypeMap**: *FieldTypeMap*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[fieldTypeMap](cachemanagercontext.md#fieldtypemap)*

Defined in core/lib/types/defs/index.d.ts:121

___

### `Optional` fragmentDefinitions

• **fragmentDefinitions**? : *FragmentDefinitionNodeMap*

*Defined in [cache-manager/src/defs/index.ts:67](https://github.com/badbatch/graphql-box/blob/dc19a43/packages/cache-manager/src/defs/index.ts#L67)*

___

### `Optional` hasDeferOrStream

• **hasDeferOrStream**? : *undefined | false | true*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[hasDeferOrStream](cachemanagercontext.md#optional-hasdeferorstream)*

Defined in core/lib/types/defs/index.d.ts:122

___

###  operation

• **operation**: *ValidOperations*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[operation](cachemanagercontext.md#operation)*

Defined in core/lib/types/defs/index.d.ts:123

___

###  operationName

• **operationName**: *string*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[operationName](cachemanagercontext.md#operationname)*

Defined in core/lib/types/defs/index.d.ts:124

___

###  queryFiltered

• **queryFiltered**: *boolean*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[queryFiltered](cachemanagercontext.md#queryfiltered)*

Defined in core/lib/types/defs/index.d.ts:125

___

###  request

• **request**: *string*

*Inherited from [CacheManagerContext](cachemanagercontext.md).[request](cachemanagercontext.md#request)*

Defined in core/lib/types/defs/index.d.ts:126

___

### `Optional` typeIDKey

• **typeIDKey**? : *undefined | string*

*Defined in [cache-manager/src/defs/index.ts:68](https://github.com/badbatch/graphql-box/blob/dc19a43/packages/cache-manager/src/defs/index.ts#L68)*
