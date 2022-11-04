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
* [MaybeRawFetchDataObjectMap](interfaces/mayberawfetchdataobjectmap.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [ActiveBatch](README.md#activebatch)

### Variables

* [URL](README.md#const-url)

### Functions

* [convertNullArrayEntriesToUndefined](README.md#const-convertnullarrayentriestoundefined)
* [logFetch](README.md#logfetch)

## Type aliases

###  ActiveBatch

Ƭ **ActiveBatch**: *Map‹string, [ActiveBatchValue](interfaces/activebatchvalue.md)›*

*Defined in [defs/index.ts:58](https://github.com/badbatch/graphql-box/blob/a215d380/packages/fetch-manager/src/defs/index.ts#L58)*

## Variables

### `Const` URL

• **URL**: *"https://api.github.com/graphql"* = "https://api.github.com/graphql"

*Defined in [index.test.ts:20](https://github.com/badbatch/graphql-box/blob/a215d380/packages/fetch-manager/src/index.test.ts#L20)*

## Functions

### `Const` convertNullArrayEntriesToUndefined

▸ **convertNullArrayEntriesToUndefined**(`data`: PlainObjectMap): *PlainObjectMap‹any›*

*Defined in [helpers/cleanPatchResponse.ts:4](https://github.com/badbatch/graphql-box/blob/a215d380/packages/fetch-manager/src/helpers/cleanPatchResponse.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | PlainObjectMap |

**Returns:** *PlainObjectMap‹any›*

___

###  logFetch

▸ **logFetch**(): *(Anonymous function)*

*Defined in [debug/log-fetch/index.ts:4](https://github.com/badbatch/graphql-box/blob/a215d380/packages/fetch-manager/src/debug/log-fetch/index.ts#L4)*

**Returns:** *(Anonymous function)*
