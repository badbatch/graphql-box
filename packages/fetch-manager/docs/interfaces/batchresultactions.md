[Documentation](../README.md) > [BatchResultActions](../interfaces/batchresultactions.md)

# Interface: BatchResultActions

## Hierarchy

**BatchResultActions**

## Index

### Properties

* [reject](batchresultactions.md#reject)
* [resolve](batchresultactions.md#resolve)

---

## Properties

<a id="reject"></a>

###  reject

**● reject**: *`function`*

*Defined in [defs/index.ts:55](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/defs/index.ts#L55)*

#### Type declaration
▸(reason: *`Error` \| `Error`[]*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| reason | `Error` \| `Error`[] |

**Returns:** `void`

___
<a id="resolve"></a>

###  resolve

**● resolve**: *`function`*

*Defined in [defs/index.ts:56](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/defs/index.ts#L56)*

#### Type declaration
▸(value: *`MaybeRawResponseData`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `MaybeRawResponseData` |

**Returns:** `void`

___

