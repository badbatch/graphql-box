[Documentation](../README.md) › [UserOptions](useroptions.md)

# Interface: UserOptions

## Hierarchy

* **UserOptions**

## Index

### Properties

* [introspection](useroptions.md#optional-introspection)
* [maxFieldDepth](useroptions.md#optional-maxfielddepth)
* [maxTypeComplexity](useroptions.md#optional-maxtypecomplexity)
* [schema](useroptions.md#optional-schema)
* [typeComplexityMap](useroptions.md#optional-typecomplexitymap)

## Properties

### `Optional` introspection

• **introspection**? : *IntrospectionQuery*

*Defined in [defs/index.ts:9](https://github.com/badbatch/graphql-box/blob/c173ad2/packages/request-parser/src/defs/index.ts#L9)*

Output of an introspection query.

___

### `Optional` maxFieldDepth

• **maxFieldDepth**? : *undefined | number*

*Defined in [defs/index.ts:14](https://github.com/badbatch/graphql-box/blob/c173ad2/packages/request-parser/src/defs/index.ts#L14)*

The maximum request field depth per request.

___

### `Optional` maxTypeComplexity

• **maxTypeComplexity**? : *undefined | number*

*Defined in [defs/index.ts:19](https://github.com/badbatch/graphql-box/blob/c173ad2/packages/request-parser/src/defs/index.ts#L19)*

The maximum type cost per request.

___

### `Optional` schema

• **schema**? : *GraphQLSchema*

*Defined in [defs/index.ts:24](https://github.com/badbatch/graphql-box/blob/c173ad2/packages/request-parser/src/defs/index.ts#L24)*

A GraphQL schema.

___

### `Optional` typeComplexityMap

• **typeComplexityMap**? : *Record‹string, number›*

*Defined in [defs/index.ts:29](https://github.com/badbatch/graphql-box/blob/c173ad2/packages/request-parser/src/defs/index.ts#L29)*

The cost of requesting a type.
