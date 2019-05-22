
#  Documentation

## Index

### Classes

* [EventAsyncIterator](classes/eventasynciterator.md)

### Interfaces

* [FieldAndTypeName](interfaces/fieldandtypename.md)
* [FragmentDefinitionNodeMap](interfaces/fragmentdefinitionnodemap.md)
* [VariableTypesMap](interfaces/variabletypesmap.md)

### Type aliases

* [GraphQLNullableOutputType](#graphqlnullableoutputtype)
* [NamedASTNode](#namedastnode)
* [ParentNode](#parentnode)
* [ParseValueResult](#parsevalueresult)
* [ScalarValueNode](#scalarvaluenode)

### Variables

* [DOCUMENT](#document)
* [FIELD](#field)
* [FRAGMENT_DEFINITION](#fragment_definition)
* [FRAGMENT_SPREAD](#fragment_spread)
* [INLINE_FRAGMENT](#inline_fragment)
* [LIST_VALUE](#list_value)
* [NAME](#name)
* [OBJECT_VALUE](#object_value)
* [OF_TYPE](#of_type)
* [OPERATION_DEFINITION](#operation_definition)
* [STRING](#string)
* [TYPE](#type)
* [VALUE](#value)
* [VARIABLE](#variable)
* [VARIABLE_DEFINITION](#variable_definition)

### Functions

* [addChildField](#addchildfield)
* [dehydrateCacheMetadata](#dehydratecachemetadata)
* [deleteChildFields](#deletechildfields)
* [deleteFragmentDefinitions](#deletefragmentdefinitions)
* [deleteInlineFragments](#deleteinlinefragments)
* [deleteVariableDefinitions](#deletevariabledefinitions)
* [getAlias](#getalias)
* [getArguments](#getarguments)
* [getChildFields](#getchildfields)
* [getDirectives](#getdirectives)
* [getFragmentDefinitions](#getfragmentdefinitions)
* [getInlineFragments](#getinlinefragments)
* [getKind](#getkind)
* [getName](#getname)
* [getOperationDefinitions](#getoperationdefinitions)
* [getType](#gettype)
* [getTypeCondition](#gettypecondition)
* [getVariableDefinitionType](#getvariabledefinitiontype)
* [hasChildFields](#haschildfields)
* [hasFragmentDefinitions](#hasfragmentdefinitions)
* [hasFragmentSpreads](#hasfragmentspreads)
* [hasInlineFragments](#hasinlinefragments)
* [hasVariableDefinitions](#hasvariabledefinitions)
* [hashRequest](#hashrequest)
* [iterateChildFields](#iteratechildfields)
* [mergeObjects](#mergeobjects)
* [parseValue](#parsevalue)
* [rehydrateCacheMetadata](#rehydratecachemetadata)
* [setFragmentDefinitions](#setfragmentdefinitions)
* [setInlineFragments](#setinlinefragments)
* [unwrapInlineFragments](#unwrapinlinefragments)
* [unwrapOfType](#unwrapoftype)
* [variableDefinitionTypeVisitor](#variabledefinitiontypevisitor)

---

## Type aliases

<a id="graphqlnullableoutputtype"></a>

###  GraphQLNullableOutputType

**Ƭ GraphQLNullableOutputType**: *`GraphQLScalarType` \| `GraphQLObjectType` \| `GraphQLInterfaceType` \| `GraphQLUnionType` \| `GraphQLEnumType` \| `GraphQLList`<`any`>*

*Defined in [defs/index.ts:45](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/defs/index.ts#L45)*

___
<a id="namedastnode"></a>

###  NamedASTNode

**Ƭ NamedASTNode**: *`OperationDefinitionNode` \| `VariableNode` \| `FieldNode` \| `ArgumentNode` \| `FragmentSpreadNode` \| `FragmentDefinitionNode` \| `ObjectFieldNode` \| `DirectiveNode` \| `NamedTypeNode` \| `ScalarTypeDefinitionNode` \| `ObjectTypeDefinitionNode` \| `FieldDefinitionNode` \| `InputValueDefinitionNode` \| `InterfaceTypeDefinitionNode` \| `UnionTypeDefinitionNode` \| `EnumTypeDefinitionNode` \| `EnumValueDefinitionNode` \| `InputObjectTypeDefinitionNode` \| `DirectiveDefinitionNode`*

*Defined in [defs/index.ts:53](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/defs/index.ts#L53)*

___
<a id="parentnode"></a>

###  ParentNode

**Ƭ ParentNode**: *`FieldNode` \| `InlineFragmentNode` \| `OperationDefinitionNode` \| `FragmentDefinitionNode`*

*Defined in [defs/index.ts:74](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/defs/index.ts#L74)*

___
<a id="parsevalueresult"></a>

###  ParseValueResult

**Ƭ ParseValueResult**: *`string` \| `boolean` \| `null` \| `PlainObjectMap` \| `any`[]*

*Defined in [parsing/arguments/index.ts:6](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/arguments/index.ts#L6)*

___
<a id="scalarvaluenode"></a>

###  ScalarValueNode

**Ƭ ScalarValueNode**: *`IntValueNode` \| `FloatValueNode` \| `StringValueNode` \| `BooleanValueNode` \| `EnumValueNode`*

*Defined in [defs/index.ts:80](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/defs/index.ts#L80)*

___

## Variables

<a id="document"></a>

### `<Const>` DOCUMENT

**● DOCUMENT**: *"Document"* = "Document"

*Defined in [consts/index.ts:1](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/consts/index.ts#L1)*

___
<a id="field"></a>

### `<Const>` FIELD

**● FIELD**: *"Field"* = "Field"

*Defined in [consts/index.ts:2](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/consts/index.ts#L2)*

___
<a id="fragment_definition"></a>

### `<Const>` FRAGMENT_DEFINITION

**● FRAGMENT_DEFINITION**: *"FragmentDefinition"* = "FragmentDefinition"

*Defined in [consts/index.ts:3](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/consts/index.ts#L3)*

___
<a id="fragment_spread"></a>

### `<Const>` FRAGMENT_SPREAD

**● FRAGMENT_SPREAD**: *"FragmentSpread"* = "FragmentSpread"

*Defined in [consts/index.ts:4](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/consts/index.ts#L4)*

___
<a id="inline_fragment"></a>

### `<Const>` INLINE_FRAGMENT

**● INLINE_FRAGMENT**: *"InlineFragment"* = "InlineFragment"

*Defined in [consts/index.ts:5](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/consts/index.ts#L5)*

___
<a id="list_value"></a>

### `<Const>` LIST_VALUE

**● LIST_VALUE**: *"ListValue"* = "ListValue"

*Defined in [consts/index.ts:6](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/consts/index.ts#L6)*

___
<a id="name"></a>

### `<Const>` NAME

**● NAME**: *"name"* = "name"

*Defined in [consts/index.ts:7](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/consts/index.ts#L7)*

___
<a id="object_value"></a>

### `<Const>` OBJECT_VALUE

**● OBJECT_VALUE**: *"ObjectValue"* = "ObjectValue"

*Defined in [consts/index.ts:8](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/consts/index.ts#L8)*

___
<a id="of_type"></a>

### `<Const>` OF_TYPE

**● OF_TYPE**: *"ofType"* = "ofType"

*Defined in [consts/index.ts:9](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/consts/index.ts#L9)*

___
<a id="operation_definition"></a>

### `<Const>` OPERATION_DEFINITION

**● OPERATION_DEFINITION**: *"OperationDefinition"* = "OperationDefinition"

*Defined in [consts/index.ts:10](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/consts/index.ts#L10)*

___
<a id="string"></a>

### `<Const>` STRING

**● STRING**: *"String"* = "String"

*Defined in [consts/index.ts:11](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/consts/index.ts#L11)*

___
<a id="type"></a>

### `<Const>` TYPE

**● TYPE**: *"type"* = "type"

*Defined in [consts/index.ts:12](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/consts/index.ts#L12)*

___
<a id="value"></a>

### `<Const>` VALUE

**● VALUE**: *"value"* = "value"

*Defined in [consts/index.ts:13](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/consts/index.ts#L13)*

___
<a id="variable"></a>

### `<Const>` VARIABLE

**● VARIABLE**: *"Variable"* = "Variable"

*Defined in [consts/index.ts:14](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/consts/index.ts#L14)*

___
<a id="variable_definition"></a>

### `<Const>` VARIABLE_DEFINITION

**● VARIABLE_DEFINITION**: *"VariableDefinition"* = "VariableDefinition"

*Defined in [consts/index.ts:15](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/consts/index.ts#L15)*

___

## Functions

<a id="addchildfield"></a>

###  addChildField

▸ **addChildField**(node: *[ParentNode](#parentnode)*, field: *`FieldNode`*, schema: *`GraphQLSchema`*, typeIDKey: *`string`*): `void`

*Defined in [parsing/child-fields/index.ts:10](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/child-fields/index.ts#L10)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| node | [ParentNode](#parentnode) |
| field | `FieldNode` |
| schema | `GraphQLSchema` |
| typeIDKey | `string` |

**Returns:** `void`

___
<a id="dehydratecachemetadata"></a>

###  dehydrateCacheMetadata

▸ **dehydrateCacheMetadata**(cacheMetadata: *`CacheMetadata`*): `DehydratedCacheMetadata`

*Defined in [cache-metadata/index.ts:4](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/cache-metadata/index.ts#L4)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| cacheMetadata | `CacheMetadata` |

**Returns:** `DehydratedCacheMetadata`

___
<a id="deletechildfields"></a>

###  deleteChildFields

▸ **deleteChildFields**(node: *[ParentNode](#parentnode)*, fields: *`FieldNode`[] \| `FieldNode`*): `void`

*Defined in [parsing/child-fields/index.ts:50](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/child-fields/index.ts#L50)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| node | [ParentNode](#parentnode) |
| fields | `FieldNode`[] \| `FieldNode` |

**Returns:** `void`

___
<a id="deletefragmentdefinitions"></a>

###  deleteFragmentDefinitions

▸ **deleteFragmentDefinitions**(documentNode: *`DocumentNode`*): `DocumentNode`

*Defined in [parsing/fragment-definitions/index.ts:7](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/fragment-definitions/index.ts#L7)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| documentNode | `DocumentNode` |

**Returns:** `DocumentNode`

___
<a id="deleteinlinefragments"></a>

###  deleteInlineFragments

▸ **deleteInlineFragments**(node: *[ParentNode](#parentnode)*, inlineFragments: *`InlineFragmentNode`[] \| `InlineFragmentNode`*): `void`

*Defined in [parsing/inline-fragments/index.ts:8](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/inline-fragments/index.ts#L8)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| node | [ParentNode](#parentnode) |
| inlineFragments | `InlineFragmentNode`[] \| `InlineFragmentNode` |

**Returns:** `void`

___
<a id="deletevariabledefinitions"></a>

###  deleteVariableDefinitions

▸ **deleteVariableDefinitions**(operationDefinition: *`OperationDefinitionNode`*): `OperationDefinitionNode`

*Defined in [parsing/variable-definitions/index.ts:12](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/variable-definitions/index.ts#L12)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| operationDefinition | `OperationDefinitionNode` |

**Returns:** `OperationDefinitionNode`

___
<a id="getalias"></a>

###  getAlias

▸ **getAlias**(__namedParameters: *`object`*): `string` \| `undefined`

*Defined in [parsing/alias/index.ts:3](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/alias/index.ts#L3)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| alias | `undefined` \| `NameNode` |

**Returns:** `string` \| `undefined`

___
<a id="getarguments"></a>

###  getArguments

▸ **getArguments**(field: *`FieldNode` \| `DirectiveNode`*): `PlainObjectMap` \| `undefined`

*Defined in [parsing/arguments/index.ts:39](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/arguments/index.ts#L39)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| field | `FieldNode` \| `DirectiveNode` |

**Returns:** `PlainObjectMap` \| `undefined`

___
<a id="getchildfields"></a>

###  getChildFields

▸ **getChildFields**(node: *[ParentNode](#parentnode)*, name?: *`undefined` \| `string`*): [FieldAndTypeName](interfaces/fieldandtypename.md)[] \| `undefined`

*Defined in [parsing/child-fields/index.ts:72](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/child-fields/index.ts#L72)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| node | [ParentNode](#parentnode) |
| `Optional` name | `undefined` \| `string` |

**Returns:** [FieldAndTypeName](interfaces/fieldandtypename.md)[] \| `undefined`

___
<a id="getdirectives"></a>

###  getDirectives

▸ **getDirectives**(field: *`FieldNode`*): `PlainObjectMap` \| `undefined`

*Defined in [parsing/directives/index.ts:5](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/directives/index.ts#L5)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| field | `FieldNode` |

**Returns:** `PlainObjectMap` \| `undefined`

___
<a id="getfragmentdefinitions"></a>

###  getFragmentDefinitions

▸ **getFragmentDefinitions**(__namedParameters: *`object`*): [FragmentDefinitionNodeMap](interfaces/fragmentdefinitionnodemap.md) \| `undefined`

*Defined in [parsing/fragment-definitions/index.ts:22](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/fragment-definitions/index.ts#L22)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| definitions | `ReadonlyArray`<`FragmentDefinitionNode` \| `OperationDefinitionNode` \| `ScalarTypeDefinitionNode` \| `ObjectTypeDefinitionNode` \| `InterfaceTypeDefinitionNode` \| `UnionTypeDefinitionNode` \| `EnumTypeDefinitionNode` \| `InputObjectTypeDefinitionNode` \| `DirectiveDefinitionNode` \| `SchemaDefinitionNode` \| `object` \| `ScalarTypeExtensionNode` \| `ObjectTypeExtensionNode` \| `InterfaceTypeExtensionNode` \| `UnionTypeExtensionNode` \| `EnumTypeExtensionNode` \| `InputObjectTypeExtensionNode`> |

**Returns:** [FragmentDefinitionNodeMap](interfaces/fragmentdefinitionnodemap.md) \| `undefined`

___
<a id="getinlinefragments"></a>

###  getInlineFragments

▸ **getInlineFragments**(__namedParameters: *`object`*): `InlineFragmentNode`[]

*Defined in [parsing/inline-fragments/index.ts:30](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/inline-fragments/index.ts#L30)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| selectionSet | `undefined` \| `SelectionSetNode` |

**Returns:** `InlineFragmentNode`[]

___
<a id="getkind"></a>

###  getKind

▸ **getKind**(__namedParameters: *`object`*): `string`

*Defined in [parsing/kind/index.ts:3](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/kind/index.ts#L3)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| kind | "Document" \| "Field" \| "FragmentDefinition" \| "FragmentSpread" \| "InlineFragment" \| "ListValue" \| "ObjectValue" \| "OperationDefinition" \| "Variable" \| "VariableDefinition" \| "Name" \| "Argument" \| "ObjectField" \| "Directive" \| "NamedType" \| "ScalarTypeDefinition" \| "ObjectTypeDefinition" \| "FieldDefinition" \| "InputValueDefinition" \| "InterfaceTypeDefinition" \| "UnionTypeDefinition" \| "EnumTypeDefinition" \| "EnumValueDefinition" \| "InputObjectTypeDefinition" \| "DirectiveDefinition" \| "IntValue" \| "FloatValue" \| "StringValue" \| "BooleanValue" \| "EnumValue" \| "NullValue" \| "SelectionSet" \| "ListType" \| "NonNullType" \| "SchemaDefinition" \| "OperationTypeDefinition" \| "SchemaExtension" \| "ScalarTypeExtension" \| "ObjectTypeExtension" \| "InterfaceTypeExtension" \| "UnionTypeExtension" \| "EnumTypeExtension" \| "InputObjectTypeExtension" |

**Returns:** `string`

___
<a id="getname"></a>

###  getName

▸ **getName**(node: *`ASTNode`*): `string` \| `undefined`

*Defined in [parsing/name/index.ts:5](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/name/index.ts#L5)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| node | `ASTNode` |

**Returns:** `string` \| `undefined`

___
<a id="getoperationdefinitions"></a>

###  getOperationDefinitions

▸ **getOperationDefinitions**(__namedParameters: *`object`*, name?: *`undefined` \| `string`*): `OperationDefinitionNode`[]

*Defined in [parsing/operation-definitions/index.ts:5](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/operation-definitions/index.ts#L5)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| definitions | `ReadonlyArray`<`FragmentDefinitionNode` \| `OperationDefinitionNode` \| `ScalarTypeDefinitionNode` \| `ObjectTypeDefinitionNode` \| `InterfaceTypeDefinitionNode` \| `UnionTypeDefinitionNode` \| `EnumTypeDefinitionNode` \| `InputObjectTypeDefinitionNode` \| `DirectiveDefinitionNode` \| `SchemaDefinitionNode` \| `object` \| `ScalarTypeExtensionNode` \| `ObjectTypeExtensionNode` \| `InterfaceTypeExtensionNode` \| `UnionTypeExtensionNode` \| `EnumTypeExtensionNode` \| `InputObjectTypeExtensionNode`> |

**`Optional` name: `undefined` \| `string`**

**Returns:** `OperationDefinitionNode`[]

___
<a id="gettype"></a>

###  getType

▸ **getType**(__namedParameters: *`object`*): `GraphQLOutputType`

*Defined in [parsing/type/index.ts:17](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/type/index.ts#L17)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| type | `GraphQLScalarType` \| `GraphQLObjectType`<`any`, `any`, `object`> \| `GraphQLInterfaceType` \| `GraphQLUnionType` \| `GraphQLEnumType` \| `GraphQLList`<`any`> \| `GraphQLNonNull`<`GraphQLScalarType` \| `GraphQLObjectType`<`any`, `any`, `object`> \| `GraphQLInterfaceType` \| `GraphQLUnionType` \| `GraphQLEnumType` \| `GraphQLList`<`any`>> |

**Returns:** `GraphQLOutputType`

___
<a id="gettypecondition"></a>

###  getTypeCondition

▸ **getTypeCondition**(__namedParameters: *`object`*): `NamedTypeNode` \| `undefined`

*Defined in [parsing/type-condition/index.ts:3](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/type-condition/index.ts#L3)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| typeCondition | `undefined` \| `NamedTypeNode` |

**Returns:** `NamedTypeNode` \| `undefined`

___
<a id="getvariabledefinitiontype"></a>

###  getVariableDefinitionType

▸ **getVariableDefinitionType**(__namedParameters: *`object`*): `string`

*Defined in [parsing/variable-definitions/index.ts:32](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/variable-definitions/index.ts#L32)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| type | `NamedTypeNode` \| `ListTypeNode` \| `NonNullTypeNode` |

**Returns:** `string`

___
<a id="haschildfields"></a>

###  hasChildFields

▸ **hasChildFields**(node: *[ParentNode](#parentnode)*, name?: *`undefined` \| `string`*): `boolean`

*Defined in [parsing/child-fields/index.ts:84](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/child-fields/index.ts#L84)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| node | [ParentNode](#parentnode) |
| `Optional` name | `undefined` \| `string` |

**Returns:** `boolean`

___
<a id="hasfragmentdefinitions"></a>

###  hasFragmentDefinitions

▸ **hasFragmentDefinitions**(__namedParameters: *`object`*): `boolean`

*Defined in [parsing/fragment-definitions/index.ts:40](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/fragment-definitions/index.ts#L40)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| definitions | `ReadonlyArray`<`FragmentDefinitionNode` \| `OperationDefinitionNode` \| `ScalarTypeDefinitionNode` \| `ObjectTypeDefinitionNode` \| `InterfaceTypeDefinitionNode` \| `UnionTypeDefinitionNode` \| `EnumTypeDefinitionNode` \| `InputObjectTypeDefinitionNode` \| `DirectiveDefinitionNode` \| `SchemaDefinitionNode` \| `object` \| `ScalarTypeExtensionNode` \| `ObjectTypeExtensionNode` \| `InterfaceTypeExtensionNode` \| `UnionTypeExtensionNode` \| `EnumTypeExtensionNode` \| `InputObjectTypeExtensionNode`> |

**Returns:** `boolean`

___
<a id="hasfragmentspreads"></a>

###  hasFragmentSpreads

▸ **hasFragmentSpreads**(__namedParameters: *`object`*): `boolean`

*Defined in [parsing/fragment-spreads/index.ts:5](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/fragment-spreads/index.ts#L5)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| selectionSet | `undefined` \| `SelectionSetNode` |

**Returns:** `boolean`

___
<a id="hasinlinefragments"></a>

###  hasInlineFragments

▸ **hasInlineFragments**(__namedParameters: *`object`*): `boolean`

*Defined in [parsing/inline-fragments/index.ts:48](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/inline-fragments/index.ts#L48)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| selectionSet | `undefined` \| `SelectionSetNode` |

**Returns:** `boolean`

___
<a id="hasvariabledefinitions"></a>

###  hasVariableDefinitions

▸ **hasVariableDefinitions**(__namedParameters: *`object`*): `boolean`

*Defined in [parsing/variable-definitions/index.ts:19](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/variable-definitions/index.ts#L19)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| variableDefinitions | `undefined` \| `ReadonlyArray`<`VariableDefinitionNode`> |

**Returns:** `boolean`

___
<a id="hashrequest"></a>

###  hashRequest

▸ **hashRequest**(value: *`string`*): `string`

*Defined in [hash-request/index.ts:3](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/hash-request/index.ts#L3)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `string` |

**Returns:** `string`

___
<a id="iteratechildfields"></a>

###  iterateChildFields

▸ **iterateChildFields**(field: *`FieldNode`*, data: *`PlainObjectMap` \| `any`[]*, callback: *`function`*): `void`

*Defined in [parsing/child-fields/index.ts:93](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/child-fields/index.ts#L93)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| field | `FieldNode` |
| data | `PlainObjectMap` \| `any`[] |
| callback | `function` |

**Returns:** `void`

___
<a id="mergeobjects"></a>

###  mergeObjects

▸ **mergeObjects**<`T`>(obj: *`T`*, src: *`T`*, matcher: *`function`*): `T`

*Defined in [merge-objects/index.ts:9](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/merge-objects/index.ts#L9)*

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| obj | `T` |
| src | `T` |
| matcher | `function` |

**Returns:** `T`

___
<a id="parsevalue"></a>

###  parseValue

▸ **parseValue**(valueNode: *`ValueNode`*): [ParseValueResult](#parsevalueresult)

*Defined in [parsing/arguments/index.ts:8](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/arguments/index.ts#L8)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| valueNode | `ValueNode` |

**Returns:** [ParseValueResult](#parsevalueresult)

___
<a id="rehydratecachemetadata"></a>

###  rehydrateCacheMetadata

▸ **rehydrateCacheMetadata**(dehydratedCacheMetadata: *`DehydratedCacheMetadata`*, cacheMetadata?: *`CacheMetadata`*): `CacheMetadata`

*Defined in [cache-metadata/index.ts:14](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/cache-metadata/index.ts#L14)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| dehydratedCacheMetadata | `DehydratedCacheMetadata` | - |
| `Default value` cacheMetadata | `CacheMetadata` |  new Map() |

**Returns:** `CacheMetadata`

___
<a id="setfragmentdefinitions"></a>

###  setFragmentDefinitions

▸ **setFragmentDefinitions**(fragmentDefinitions: *[FragmentDefinitionNodeMap](interfaces/fragmentdefinitionnodemap.md)*, node: *`FieldNode`*): `void`

*Defined in [parsing/fragment-definitions/index.ts:44](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/fragment-definitions/index.ts#L44)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| fragmentDefinitions | [FragmentDefinitionNodeMap](interfaces/fragmentdefinitionnodemap.md) |
| node | `FieldNode` |

**Returns:** `void`

___
<a id="setinlinefragments"></a>

###  setInlineFragments

▸ **setInlineFragments**(__namedParameters: *`object`*): `void`

*Defined in [parsing/inline-fragments/index.ts:53](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/inline-fragments/index.ts#L53)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| selectionSet | `undefined` \| `SelectionSetNode` |

**Returns:** `void`

___
<a id="unwrapinlinefragments"></a>

###  unwrapInlineFragments

▸ **unwrapInlineFragments**(selectionNodes: *`ReadonlyArray`<`SelectionNode`>*, maxDepth?: *`number`*, depth?: *`number`*, typeName?: *`undefined` \| `string`*): [FieldAndTypeName](interfaces/fieldandtypename.md)[]

*Defined in [parsing/inline-fragments/index.ts:72](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/inline-fragments/index.ts#L72)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| selectionNodes | `ReadonlyArray`<`SelectionNode`> | - |
| `Default value` maxDepth | `number` | 1 |
| `Default value` depth | `number` | 0 |
| `Optional` typeName | `undefined` \| `string` | - |

**Returns:** [FieldAndTypeName](interfaces/fieldandtypename.md)[]

___
<a id="unwrapoftype"></a>

###  unwrapOfType

▸ **unwrapOfType**(type: *`GraphQLOutputType`*): `GraphQLOutputType`

*Defined in [parsing/type/index.ts:10](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/type/index.ts#L10)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| type | `GraphQLOutputType` |

**Returns:** `GraphQLOutputType`

___
<a id="variabledefinitiontypevisitor"></a>

###  variableDefinitionTypeVisitor

▸ **variableDefinitionTypeVisitor**(node: *`TypeNode`*): `NamedTypeNode`

*Defined in [parsing/variable-definitions/index.ts:23](https://github.com/bad-batch/handl/blob/20503ed/packages/helpers/src/parsing/variable-definitions/index.ts#L23)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| node | `TypeNode` |

**Returns:** `NamedTypeNode`

___

