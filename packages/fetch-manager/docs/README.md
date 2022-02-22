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
* [MaybeRawFetchData](interfaces/mayberawfetchdata.md)
* [MaybeRawFetchDataObjectMap](interfaces/mayberawfetchdataobjectmap.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [ActiveBatch](README.md#activebatch)
* [ConstructorOptions](README.md#constructoroptions)
* [InitOptions](README.md#initoptions)

### Variables

* [FETCH_EXECUTED](README.md#const-fetch_executed)
* [URL](README.md#const-url)

### Functions

* [init](README.md#init)
* [logFetch](README.md#logfetch)

## Type aliases

###  ActiveBatch

Ƭ **ActiveBatch**: *Map‹string, [ActiveBatchValue](interfaces/activebatchvalue.md)›*

*Defined in [defs/index.ts:42](https://github.com/badbatch/graphql-box/blob/bf31fdc/packages/fetch-manager/src/defs/index.ts#L42)*

___

###  ConstructorOptions

Ƭ **ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:36](https://github.com/badbatch/graphql-box/blob/bf31fdc/packages/fetch-manager/src/defs/index.ts#L36)*

___

###  InitOptions

Ƭ **InitOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:34](https://github.com/badbatch/graphql-box/blob/bf31fdc/packages/fetch-manager/src/defs/index.ts#L34)*

## Variables

### `Const` FETCH_EXECUTED

• **FETCH_EXECUTED**: *"fetch_executed"* = "fetch_executed"

*Defined in [consts/index.ts:1](https://github.com/badbatch/graphql-box/blob/bf31fdc/packages/fetch-manager/src/consts/index.ts#L1)*

___

### `Const` URL

• **URL**: *"https://api.github.com/graphql"* = "https://api.github.com/graphql"

*Defined in [index.test.ts:13](https://github.com/badbatch/graphql-box/blob/bf31fdc/packages/fetch-manager/src/index.test.ts#L13)*

## Functions

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *RequestManagerInit*

*Defined in [main/index.ts:218](https://github.com/badbatch/graphql-box/blob/bf31fdc/packages/fetch-manager/src/main/index.ts#L218)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *RequestManagerInit*

___

###  logFetch

▸ **logFetch**(): *(Anonymous function)*

*Defined in [debug/log-fetch/index.ts:4](https://github.com/badbatch/graphql-box/blob/bf31fdc/packages/fetch-manager/src/debug/log-fetch/index.ts#L4)*

**Returns:** *(Anonymous function)*
