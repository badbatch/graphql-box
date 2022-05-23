[Documentation](../README.md) › [ConnectionResolverUserOptions](connectionresolveruseroptions.md)

# Interface: ConnectionResolverUserOptions ‹**Source, Args, Ctx, Resource, ResourceNode**›

## Type parameters

▪ **Source**: *[PlainObject](../README.md#plainobject) | undefined*

▪ **Args**: *[PlainObject](../README.md#plainobject)*

▪ **Ctx**: *[PlainObject](../README.md#plainobject)*

▪ **Resource**: *[PlainObject](../README.md#plainobject)*

▪ **ResourceNode**: *[Node](../README.md#node)*

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

*Defined in [packages/connection-resolver/src/defs/index.ts:84](https://github.com/badbatch/graphql-box/blob/d57a12a/packages/connection-resolver/src/defs/index.ts#L84)*

#### Type declaration:

▸ (`source`: Source, `args`: Args, `context`: Ctx, `info`: GraphQLResolveInfo): *object*

**Parameters:**

Name | Type |
------ | ------ |
`source` | Source |
`args` | Args |
`context` | Ctx |
`info` | GraphQLResolveInfo |

* **makeGroupCursor**(): *function*

  * (): *string*

* **makeIDCursor**(): *function*

  * (`id`: string | number): *string*

___

###  createResourceResolver

• **createResourceResolver**: *[CreateResourceResolver](../README.md#createresourceresolver)‹Source, Args, Ctx, Resource›*

*Defined in [packages/connection-resolver/src/defs/index.ts:93](https://github.com/badbatch/graphql-box/blob/d57a12a/packages/connection-resolver/src/defs/index.ts#L93)*

___

###  cursorCache

• **cursorCache**: *Cachemap*

*Defined in [packages/connection-resolver/src/defs/index.ts:94](https://github.com/badbatch/graphql-box/blob/d57a12a/packages/connection-resolver/src/defs/index.ts#L94)*

___

###  getters

• **getters**: *[Getters](getters.md)‹Resource, ResourceNode›*

*Defined in [packages/connection-resolver/src/defs/index.ts:95](https://github.com/badbatch/graphql-box/blob/d57a12a/packages/connection-resolver/src/defs/index.ts#L95)*

___

### `Optional` resolver

• **resolver**? : *undefined | function*

*Defined in [packages/connection-resolver/src/defs/index.ts:96](https://github.com/badbatch/graphql-box/blob/d57a12a/packages/connection-resolver/src/defs/index.ts#L96)*

___

###  resultsPerPage

• **resultsPerPage**: *number*

*Defined in [packages/connection-resolver/src/defs/index.ts:97](https://github.com/badbatch/graphql-box/blob/d57a12a/packages/connection-resolver/src/defs/index.ts#L97)*
