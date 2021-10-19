[Documentation](../README.md) › [ConnectionResolverUserOptions](connectionresolveruseroptions.md)

# Interface: ConnectionResolverUserOptions

## Hierarchy

* **ConnectionResolverUserOptions**

## Index

### Properties

* [createMakeCursors](connectionresolveruseroptions.md#createmakecursors)
* [createResourceResolver](connectionresolveruseroptions.md#createresourceresolver)
* [cursorCache](connectionresolveruseroptions.md#cursorcache)
* [getters](connectionresolveruseroptions.md#getters)
* [resolver](connectionresolveruseroptions.md#optional-resolver)
* [resultsPerPage](connectionresolveruseroptions.md#resultsperpage)

## Properties

###  createMakeCursors

• **createMakeCursors**: *function*

*Defined in [packages/connection-resolver/src/defs/index.ts:76](https://github.com/badbatch/graphql-box/blob/25fe942/packages/connection-resolver/src/defs/index.ts#L76)*

#### Type declaration:

▸ (`source`: [PlainObject](../README.md#plainobject), `args`: [PlainObject](../README.md#plainobject), `context`: [PlainObject](../README.md#plainobject), `info`: GraphQLResolveInfo): *object*

**Parameters:**

Name | Type |
------ | ------ |
`source` | [PlainObject](../README.md#plainobject) |
`args` | [PlainObject](../README.md#plainobject) |
`context` | [PlainObject](../README.md#plainobject) |
`info` | GraphQLResolveInfo |

* **makeGroupCursor**(): *function*

  * (): *string*

* **makeIDCursor**(): *function*

  * (`id`: string | number): *string*

___

###  createResourceResolver

• **createResourceResolver**: *[CreateResourceResolver](../README.md#createresourceresolver)*

*Defined in [packages/connection-resolver/src/defs/index.ts:85](https://github.com/badbatch/graphql-box/blob/25fe942/packages/connection-resolver/src/defs/index.ts#L85)*

___

###  cursorCache

• **cursorCache**: *Cachemap*

*Defined in [packages/connection-resolver/src/defs/index.ts:86](https://github.com/badbatch/graphql-box/blob/25fe942/packages/connection-resolver/src/defs/index.ts#L86)*

___

###  getters

• **getters**: *[Getters](getters.md)*

*Defined in [packages/connection-resolver/src/defs/index.ts:87](https://github.com/badbatch/graphql-box/blob/25fe942/packages/connection-resolver/src/defs/index.ts#L87)*

___

### `Optional` resolver

• **resolver**? : *undefined | function*

*Defined in [packages/connection-resolver/src/defs/index.ts:88](https://github.com/badbatch/graphql-box/blob/25fe942/packages/connection-resolver/src/defs/index.ts#L88)*

___

###  resultsPerPage

• **resultsPerPage**: *number*

*Defined in [packages/connection-resolver/src/defs/index.ts:89](https://github.com/badbatch/graphql-box/blob/25fe942/packages/connection-resolver/src/defs/index.ts#L89)*
