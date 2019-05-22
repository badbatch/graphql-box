
#  Documentation

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

* [ActiveBatch](#activebatch)
* [ConstructorOptions](#constructoroptions)
* [InitOptions](#initoptions)

### Variables

* [FETCH_EXECUTED](#fetch_executed)
* [URL](#url)

### Functions

* [init](#init)
* [logFetch](#logfetch)

---

## Type aliases

<a id="activebatch"></a>

###  ActiveBatch

**Ƭ ActiveBatch**: *`Map`<`string`, [ActiveBatchValue](interfaces/activebatchvalue.md)>*

*Defined in [defs/index.ts:47](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/defs/index.ts#L47)*

___
<a id="constructoroptions"></a>

###  ConstructorOptions

**Ƭ ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:41](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/defs/index.ts#L41)*

___
<a id="initoptions"></a>

###  InitOptions

**Ƭ InitOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:39](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/defs/index.ts#L39)*

___

## Variables

<a id="fetch_executed"></a>

### `<Const>` FETCH_EXECUTED

**● FETCH_EXECUTED**: *"fetch_executed"* = "fetch_executed"

*Defined in [consts/index.ts:1](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/consts/index.ts#L1)*

___
<a id="url"></a>

### `<Const>` URL

**● URL**: *"https://api.github.com/graphql"* = "https://api.github.com/graphql"

*Defined in [index.test.ts:11](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/index.test.ts#L11)*

___

## Functions

<a id="init"></a>

###  init

▸ **init**(userOptions: *[UserOptions](interfaces/useroptions.md)*): `RequestManagerInit`

*Defined in [main/index.ts:209](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/main/index.ts#L209)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| userOptions | [UserOptions](interfaces/useroptions.md) |

**Returns:** `RequestManagerInit`

___
<a id="logfetch"></a>

###  logFetch

▸ **logFetch**(): `(Anonymous function)`

*Defined in [debug/log-fetch/index.ts:4](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/debug/log-fetch/index.ts#L4)*

**Returns:** `(Anonymous function)`

___

