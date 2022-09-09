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

*Defined in [defs/index.ts:66](https://github.com/badbatch/graphql-box/blob/4e42c8bb/packages/fetch-manager/src/defs/index.ts#L66)*

#### Type declaration:

▸ (`reason`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`reason` | Error |

___

###  resolve

• **resolve**: *function*

*Defined in [defs/index.ts:67](https://github.com/badbatch/graphql-box/blob/4e42c8bb/packages/fetch-manager/src/defs/index.ts#L67)*

#### Type declaration:

▸ (`value`: MaybeRawResponseData): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | MaybeRawResponseData |
