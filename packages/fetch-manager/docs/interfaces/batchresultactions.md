[Documentation](../README.md) › [BatchResultActions](batchresultactions.md)

# Interface: BatchResultActions

## Hierarchy

* **BatchResultActions**

## Index

### Properties

* [reject](batchresultactions.md#reject)
* [resolve](batchresultactions.md#resolve)

## Properties

###  reject

• **reject**: *function*

*Defined in [defs/index.ts:62](https://github.com/badbatch/graphql-box/blob/e36f8d4/packages/fetch-manager/src/defs/index.ts#L62)*

#### Type declaration:

▸ (`reason`: Error | Error[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`reason` | Error &#124; Error[] |

___

###  resolve

• **resolve**: *function*

*Defined in [defs/index.ts:63](https://github.com/badbatch/graphql-box/blob/e36f8d4/packages/fetch-manager/src/defs/index.ts#L63)*

#### Type declaration:

▸ (`value`: MaybeRawResponseData): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | MaybeRawResponseData |
