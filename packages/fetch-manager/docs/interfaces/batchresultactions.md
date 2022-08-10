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

*Defined in [defs/index.ts:61](https://github.com/badbatch/graphql-box/blob/bd9b7ae/packages/fetch-manager/src/defs/index.ts#L61)*

#### Type declaration:

▸ (`reason`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`reason` | Error |

___

###  resolve

• **resolve**: *function*

*Defined in [defs/index.ts:62](https://github.com/badbatch/graphql-box/blob/bd9b7ae/packages/fetch-manager/src/defs/index.ts#L62)*

#### Type declaration:

▸ (`value`: MaybeRawResponseData): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | MaybeRawResponseData |
