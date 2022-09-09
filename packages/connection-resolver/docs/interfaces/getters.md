[Documentation](../README.md) › [Getters](getters.md)

# Interface: Getters ‹**Resource, ResourceNode**›

## Type parameters

▪ **Resource**: *[PlainObject](../README.md#plainobject)*

▪ **ResourceNode**: *[Node](../README.md#node)*

## Hierarchy

* **Getters**

## Index

### Properties

* [nodes](getters.md#nodes)
* [page](getters.md#page)
* [totalPages](getters.md#totalpages)
* [totalResults](getters.md#totalresults)

## Properties

###  nodes

• **nodes**: *function*

*Defined in [packages/connection-resolver/src/defs/index.ts:71](https://github.com/badbatch/graphql-box/blob/4e42c8bb/packages/connection-resolver/src/defs/index.ts#L71)*

#### Type declaration:

▸ (`obj`: Resource): *ResourceNode[]*

**Parameters:**

Name | Type |
------ | ------ |
`obj` | Resource |

___

###  page

• **page**: *function*

*Defined in [packages/connection-resolver/src/defs/index.ts:72](https://github.com/badbatch/graphql-box/blob/4e42c8bb/packages/connection-resolver/src/defs/index.ts#L72)*

#### Type declaration:

▸ (`obj`: Resource): *number*

**Parameters:**

Name | Type |
------ | ------ |
`obj` | Resource |

___

###  totalPages

• **totalPages**: *function*

*Defined in [packages/connection-resolver/src/defs/index.ts:73](https://github.com/badbatch/graphql-box/blob/4e42c8bb/packages/connection-resolver/src/defs/index.ts#L73)*

#### Type declaration:

▸ (`obj`: Resource): *number*

**Parameters:**

Name | Type |
------ | ------ |
`obj` | Resource |

___

###  totalResults

• **totalResults**: *function*

*Defined in [packages/connection-resolver/src/defs/index.ts:74](https://github.com/badbatch/graphql-box/blob/4e42c8bb/packages/connection-resolver/src/defs/index.ts#L74)*

#### Type declaration:

▸ (`obj`: Resource): *number*

**Parameters:**

Name | Type |
------ | ------ |
`obj` | Resource |
