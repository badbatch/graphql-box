[Documentation](../README.md) › [ConnectionAdapterUserOptions](connectionadapteruseroptions.md)

# Interface: ConnectionAdapterUserOptions

## Hierarchy

* **ConnectionAdapterUserOptions**

## Index

### Properties

* [createMakeCursors](connectionadapteruseroptions.md#createmakecursors)
* [createResourceResolver](connectionadapteruseroptions.md#createresourceresolver)
* [cursorCache](connectionadapteruseroptions.md#cursorcache)
* [getters](connectionadapteruseroptions.md#getters)
* [resolver](connectionadapteruseroptions.md#resolver)
* [resultsPerPage](connectionadapteruseroptions.md#resultsperpage)

## Properties

###  createMakeCursors

• **createMakeCursors**: *function*

*Defined in [packages/connection-resolver/src/defs/index.ts:72](https://github.com/badbatch/graphql-box/blob/8313ce9/packages/connection-resolver/src/defs/index.ts#L72)*

#### Type declaration:

▸ (`source`: Record‹string, any›, `args`: Record‹string, any›, `context`: Record‹string, any›, `info`: GraphQLResolveInfo): *object*

**Parameters:**

Name | Type |
------ | ------ |
`source` | Record‹string, any› |
`args` | Record‹string, any› |
`context` | Record‹string, any› |
`info` | GraphQLResolveInfo |

* **makeGroupCursor**(): *function*

  * (): *string*

* **makeIDCursor**(): *function*

  * (`id`: string | number): *string*

___

###  createResourceResolver

• **createResourceResolver**: *[CreateResourceResolver](../README.md#createresourceresolver)*

*Defined in [packages/connection-resolver/src/defs/index.ts:81](https://github.com/badbatch/graphql-box/blob/8313ce9/packages/connection-resolver/src/defs/index.ts#L81)*

___

###  cursorCache

• **cursorCache**: *Cachemap*

*Defined in [packages/connection-resolver/src/defs/index.ts:82](https://github.com/badbatch/graphql-box/blob/8313ce9/packages/connection-resolver/src/defs/index.ts#L82)*

___

###  getters

• **getters**: *[Getters](getters.md)*

*Defined in [packages/connection-resolver/src/defs/index.ts:83](https://github.com/badbatch/graphql-box/blob/8313ce9/packages/connection-resolver/src/defs/index.ts#L83)*

___

###  resolver

• **resolver**: *function*

*Defined in [packages/connection-resolver/src/defs/index.ts:84](https://github.com/badbatch/graphql-box/blob/8313ce9/packages/connection-resolver/src/defs/index.ts#L84)*

#### Type declaration:

▸ (`args`: [Connection](../README.md#connection)): *[Connection](../README.md#connection)*

**Parameters:**

Name | Type |
------ | ------ |
`args` | [Connection](../README.md#connection) |

___

###  resultsPerPage

• **resultsPerPage**: *number*

*Defined in [packages/connection-resolver/src/defs/index.ts:85](https://github.com/badbatch/graphql-box/blob/8313ce9/packages/connection-resolver/src/defs/index.ts#L85)*
