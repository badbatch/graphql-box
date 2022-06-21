[Documentation](README.md)

# Documentation

## Index

### Classes

* [FetchManager](classes/fetchmanager.md)

### Interfaces

* [ActiveBatchValue](interfaces/activebatchvalue.md)
* [BatchActionsObjectMap](interfaces/batchactionsobjectmap.md)
* [BatchResultActions](interfaces/batchresultactions.md)
* [BatchedMaybeFetchData](interfaces/batchedmaybefetchdata.md)
* [FetchOptions](interfaces/fetchoptions.md)
* [MaybeRawFetchDataObjectMap](interfaces/mayberawfetchdataobjectmap.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [ActiveBatch](README.md#activebatch)
* [ConstructorOptions](README.md#constructoroptions)

### Variables

* [FETCH_EXECUTED](README.md#const-fetch_executed)
* [GRAPHQL_ERROR](README.md#const-graphql_error)
* [URL](README.md#const-url)

### Functions

* [convertNullArrayEntriesToUndefined](README.md#const-convertnullarrayentriestoundefined)
* [init](README.md#init)
* [logFetch](README.md#logfetch)

## Type aliases

###  ActiveBatch

Ƭ **ActiveBatch**: *Map‹string, [ActiveBatchValue](interfaces/activebatchvalue.md)›*

*Defined in [defs/index.ts:52](https://github.com/badbatch/graphql-box/blob/9d329e0/packages/fetch-manager/src/defs/index.ts#L52)*

___

###  ConstructorOptions

Ƭ **ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:46](https://github.com/badbatch/graphql-box/blob/9d329e0/packages/fetch-manager/src/defs/index.ts#L46)*

## Variables

### `Const` FETCH_EXECUTED

• **FETCH_EXECUTED**: *"fetch_executed"* = "fetch_executed"

*Defined in [consts/index.ts:1](https://github.com/badbatch/graphql-box/blob/9d329e0/packages/fetch-manager/src/consts/index.ts#L1)*

___

### `Const` GRAPHQL_ERROR

• **GRAPHQL_ERROR**: *"graphql_error"* = "graphql_error"

*Defined in [consts/index.ts:2](https://github.com/badbatch/graphql-box/blob/9d329e0/packages/fetch-manager/src/consts/index.ts#L2)*

___

### `Const` URL

• **URL**: *"https://api.github.com/graphql"* = "https://api.github.com/graphql"

*Defined in [index.test.ts:20](https://github.com/badbatch/graphql-box/blob/9d329e0/packages/fetch-manager/src/index.test.ts#L20)*

## Functions

### `Const` convertNullArrayEntriesToUndefined

▸ **convertNullArrayEntriesToUndefined**(`data`: PlainObjectMap): *PlainObjectMap‹any›*

*Defined in [helpers/cleanPatchResponse.ts:4](https://github.com/badbatch/graphql-box/blob/9d329e0/packages/fetch-manager/src/helpers/cleanPatchResponse.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | PlainObjectMap |

**Returns:** *PlainObjectMap‹any›*

___

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *RequestManagerInit*

*Defined in [main/index.ts:291](https://github.com/badbatch/graphql-box/blob/9d329e0/packages/fetch-manager/src/main/index.ts#L291)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *RequestManagerInit*

___

###  logFetch

▸ **logFetch**(): *(Anonymous function)*

*Defined in [debug/log-fetch/index.ts:4](https://github.com/badbatch/graphql-box/blob/9d329e0/packages/fetch-manager/src/debug/log-fetch/index.ts#L4)*

**Returns:** *(Anonymous function)*
