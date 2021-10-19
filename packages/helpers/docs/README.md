[Documentation](README.md)

# Documentation

## Index

### Classes

* [EventAsyncIterator](classes/eventasynciterator.md)

### Interfaces

* [FieldAndTypeName](interfaces/fieldandtypename.md)
* [FragmentDefinitionNodeMap](interfaces/fragmentdefinitionnodemap.md)
* [VariableTypesMap](interfaces/variabletypesmap.md)

### Type aliases

* [GraphQLNullableOutputType](README.md#graphqlnullableoutputtype)
* [NamedASTNode](README.md#namedastnode)
* [ParentNode](README.md#parentnode)
* [ParseValueResult](README.md#parsevalueresult)
* [ScalarValueNode](README.md#scalarvaluenode)

### Variables

* [DOCUMENT](README.md#const-document)
* [FIELD](README.md#const-field)
* [FRAGMENT_DEFINITION](README.md#const-fragment_definition)
* [FRAGMENT_SPREAD](README.md#const-fragment_spread)
* [INLINE_FRAGMENT](README.md#const-inline_fragment)
* [LIST_VALUE](README.md#const-list_value)
* [NAME](README.md#const-name)
* [OBJECT_VALUE](README.md#const-object_value)
* [OF_TYPE](README.md#const-of_type)
* [OPERATION_DEFINITION](README.md#const-operation_definition)
* [STRING](README.md#const-string)
* [TYPE](README.md#const-type)
* [VALUE](README.md#const-value)
* [VARIABLE](README.md#const-variable)
* [VARIABLE_DEFINITION](README.md#const-variable_definition)

### Functions

* [addChildField](README.md#addchildfield)
* [dehydrateCacheMetadata](README.md#dehydratecachemetadata)
* [deleteChildFields](README.md#deletechildfields)
* [deleteFragmentDefinitions](README.md#deletefragmentdefinitions)
* [deleteInlineFragments](README.md#deleteinlinefragments)
* [deleteVariableDefinitions](README.md#deletevariabledefinitions)
* [getAlias](README.md#getalias)
* [getArguments](README.md#getarguments)
* [getChildFields](README.md#getchildfields)
* [getDirectives](README.md#getdirectives)
* [getFragmentDefinitions](README.md#getfragmentdefinitions)
* [getInlineFragments](README.md#getinlinefragments)
* [getKind](README.md#getkind)
* [getName](README.md#getname)
* [getOperationDefinitions](README.md#getoperationdefinitions)
* [getType](README.md#gettype)
* [getTypeCondition](README.md#gettypecondition)
* [getVariableDefinitionDefaultValue](README.md#getvariabledefinitiondefaultvalue)
* [getVariableDefinitionType](README.md#getvariabledefinitiontype)
* [hasChildFields](README.md#haschildfields)
* [hasFragmentDefinitions](README.md#hasfragmentdefinitions)
* [hasFragmentSpreads](README.md#hasfragmentspreads)
* [hasInlineFragments](README.md#hasinlinefragments)
* [hasVariableDefinitions](README.md#hasvariabledefinitions)
* [hashRequest](README.md#hashrequest)
* [iterateChildFields](README.md#iteratechildfields)
* [mergeObjects](README.md#mergeobjects)
* [parseValue](README.md#parsevalue)
* [rehydrateCacheMetadata](README.md#rehydratecachemetadata)
* [setFragmentDefinitions](README.md#setfragmentdefinitions)
* [setInlineFragments](README.md#setinlinefragments)
* [unwrapInlineFragments](README.md#unwrapinlinefragments)
* [unwrapOfType](README.md#unwrapoftype)
* [variableDefinitionTypeVisitor](README.md#variabledefinitiontypevisitor)

## Type aliases

###  GraphQLNullableOutputType

Ƭ **GraphQLNullableOutputType**: *GraphQLScalarType | GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType | GraphQLEnumType | GraphQLList‹any›*

*Defined in [packages/helpers/src/defs/index.ts:45](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/defs/index.ts#L45)*

___

###  NamedASTNode

Ƭ **NamedASTNode**: *OperationDefinitionNode | VariableNode | FieldNode | ArgumentNode | FragmentSpreadNode | FragmentDefinitionNode | ObjectFieldNode | DirectiveNode | NamedTypeNode | ScalarTypeDefinitionNode | ObjectTypeDefinitionNode | FieldDefinitionNode | InputValueDefinitionNode | InterfaceTypeDefinitionNode | UnionTypeDefinitionNode | EnumTypeDefinitionNode | EnumValueDefinitionNode | InputObjectTypeDefinitionNode | DirectiveDefinitionNode*

*Defined in [packages/helpers/src/defs/index.ts:53](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/defs/index.ts#L53)*

___

###  ParentNode

Ƭ **ParentNode**: *FieldNode | InlineFragmentNode | OperationDefinitionNode | FragmentDefinitionNode*

*Defined in [packages/helpers/src/defs/index.ts:74](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/defs/index.ts#L74)*

___

###  ParseValueResult

Ƭ **ParseValueResult**: *string | boolean | null | PlainObjectMap | any[]*

*Defined in [packages/helpers/src/parsing/arguments/index.ts:6](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/arguments/index.ts#L6)*

___

###  ScalarValueNode

Ƭ **ScalarValueNode**: *IntValueNode | FloatValueNode | StringValueNode | BooleanValueNode | EnumValueNode*

*Defined in [packages/helpers/src/defs/index.ts:76](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/defs/index.ts#L76)*

## Variables

### `Const` DOCUMENT

• **DOCUMENT**: *"Document"* = "Document"

*Defined in [packages/helpers/src/consts/index.ts:1](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/consts/index.ts#L1)*

___

### `Const` FIELD

• **FIELD**: *"Field"* = "Field"

*Defined in [packages/helpers/src/consts/index.ts:2](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/consts/index.ts#L2)*

___

### `Const` FRAGMENT_DEFINITION

• **FRAGMENT_DEFINITION**: *"FragmentDefinition"* = "FragmentDefinition"

*Defined in [packages/helpers/src/consts/index.ts:3](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/consts/index.ts#L3)*

___

### `Const` FRAGMENT_SPREAD

• **FRAGMENT_SPREAD**: *"FragmentSpread"* = "FragmentSpread"

*Defined in [packages/helpers/src/consts/index.ts:4](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/consts/index.ts#L4)*

___

### `Const` INLINE_FRAGMENT

• **INLINE_FRAGMENT**: *"InlineFragment"* = "InlineFragment"

*Defined in [packages/helpers/src/consts/index.ts:5](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/consts/index.ts#L5)*

___

### `Const` LIST_VALUE

• **LIST_VALUE**: *"ListValue"* = "ListValue"

*Defined in [packages/helpers/src/consts/index.ts:6](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/consts/index.ts#L6)*

___

### `Const` NAME

• **NAME**: *"name"* = "name"

*Defined in [packages/helpers/src/consts/index.ts:7](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/consts/index.ts#L7)*

___

### `Const` OBJECT_VALUE

• **OBJECT_VALUE**: *"ObjectValue"* = "ObjectValue"

*Defined in [packages/helpers/src/consts/index.ts:8](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/consts/index.ts#L8)*

___

### `Const` OF_TYPE

• **OF_TYPE**: *"ofType"* = "ofType"

*Defined in [packages/helpers/src/consts/index.ts:9](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/consts/index.ts#L9)*

___

### `Const` OPERATION_DEFINITION

• **OPERATION_DEFINITION**: *"OperationDefinition"* = "OperationDefinition"

*Defined in [packages/helpers/src/consts/index.ts:10](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/consts/index.ts#L10)*

___

### `Const` STRING

• **STRING**: *"String"* = "String"

*Defined in [packages/helpers/src/consts/index.ts:11](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/consts/index.ts#L11)*

___

### `Const` TYPE

• **TYPE**: *"type"* = "type"

*Defined in [packages/helpers/src/consts/index.ts:12](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/consts/index.ts#L12)*

___

### `Const` VALUE

• **VALUE**: *"value"* = "value"

*Defined in [packages/helpers/src/consts/index.ts:13](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/consts/index.ts#L13)*

___

### `Const` VARIABLE

• **VARIABLE**: *"Variable"* = "Variable"

*Defined in [packages/helpers/src/consts/index.ts:14](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/consts/index.ts#L14)*

___

### `Const` VARIABLE_DEFINITION

• **VARIABLE_DEFINITION**: *"VariableDefinition"* = "VariableDefinition"

*Defined in [packages/helpers/src/consts/index.ts:15](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/consts/index.ts#L15)*

## Functions

###  addChildField

▸ **addChildField**(`node`: [ParentNode](README.md#parentnode), `field`: FieldNode, `schema`: GraphQLSchema, `typeIDKey`: string): *void*

*Defined in [packages/helpers/src/parsing/child-fields/index.ts:10](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/child-fields/index.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [ParentNode](README.md#parentnode) |
`field` | FieldNode |
`schema` | GraphQLSchema |
`typeIDKey` | string |

**Returns:** *void*

___

###  dehydrateCacheMetadata

▸ **dehydrateCacheMetadata**(`cacheMetadata`: CacheMetadata): *DehydratedCacheMetadata*

*Defined in [packages/helpers/src/cache-metadata/index.ts:4](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/cache-metadata/index.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`cacheMetadata` | CacheMetadata |

**Returns:** *DehydratedCacheMetadata*

___

###  deleteChildFields

▸ **deleteChildFields**(`node`: [ParentNode](README.md#parentnode), `fields`: FieldNode[] | FieldNode): *void*

*Defined in [packages/helpers/src/parsing/child-fields/index.ts:45](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/child-fields/index.ts#L45)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [ParentNode](README.md#parentnode) |
`fields` | FieldNode[] &#124; FieldNode |

**Returns:** *void*

___

###  deleteFragmentDefinitions

▸ **deleteFragmentDefinitions**(`documentNode`: DocumentNode): *DocumentNode*

*Defined in [packages/helpers/src/parsing/fragment-definitions/index.ts:7](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/fragment-definitions/index.ts#L7)*

**Parameters:**

Name | Type |
------ | ------ |
`documentNode` | DocumentNode |

**Returns:** *DocumentNode*

___

###  deleteInlineFragments

▸ **deleteInlineFragments**(`node`: [ParentNode](README.md#parentnode), `inlineFragments`: InlineFragmentNode[] | InlineFragmentNode): *void*

*Defined in [packages/helpers/src/parsing/inline-fragments/index.ts:8](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/inline-fragments/index.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [ParentNode](README.md#parentnode) |
`inlineFragments` | InlineFragmentNode[] &#124; InlineFragmentNode |

**Returns:** *void*

___

###  deleteVariableDefinitions

▸ **deleteVariableDefinitions**(`operationDefinition`: OperationDefinitionNode): *OperationDefinitionNode*

*Defined in [packages/helpers/src/parsing/variable-definitions/index.ts:13](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/variable-definitions/index.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`operationDefinition` | OperationDefinitionNode |

**Returns:** *OperationDefinitionNode*

___

###  getAlias

▸ **getAlias**(`__namedParameters`: object): *string | undefined*

*Defined in [packages/helpers/src/parsing/alias/index.ts:3](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/alias/index.ts#L3)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`alias` | undefined &#124; NameNode |

**Returns:** *string | undefined*

___

###  getArguments

▸ **getArguments**(`field`: FieldNode | DirectiveNode): *PlainObjectMap | undefined*

*Defined in [packages/helpers/src/parsing/arguments/index.ts:39](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/arguments/index.ts#L39)*

**Parameters:**

Name | Type |
------ | ------ |
`field` | FieldNode &#124; DirectiveNode |

**Returns:** *PlainObjectMap | undefined*

___

###  getChildFields

▸ **getChildFields**(`node`: [ParentNode](README.md#parentnode), `name?`: undefined | string): *[FieldAndTypeName](interfaces/fieldandtypename.md)[] | undefined*

*Defined in [packages/helpers/src/parsing/child-fields/index.ts:67](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/child-fields/index.ts#L67)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [ParentNode](README.md#parentnode) |
`name?` | undefined &#124; string |

**Returns:** *[FieldAndTypeName](interfaces/fieldandtypename.md)[] | undefined*

___

###  getDirectives

▸ **getDirectives**(`field`: FieldNode): *PlainObjectMap | undefined*

*Defined in [packages/helpers/src/parsing/directives/index.ts:5](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/directives/index.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`field` | FieldNode |

**Returns:** *PlainObjectMap | undefined*

___

###  getFragmentDefinitions

▸ **getFragmentDefinitions**(`__namedParameters`: object): *[FragmentDefinitionNodeMap](interfaces/fragmentdefinitionnodemap.md) | undefined*

*Defined in [packages/helpers/src/parsing/fragment-definitions/index.ts:22](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/fragment-definitions/index.ts#L22)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`definitions` | ReadonlyArray‹FragmentDefinitionNode &#124; OperationDefinitionNode &#124; ScalarTypeDefinitionNode &#124; ObjectTypeDefinitionNode &#124; InterfaceTypeDefinitionNode &#124; UnionTypeDefinitionNode &#124; EnumTypeDefinitionNode &#124; InputObjectTypeDefinitionNode &#124; DirectiveDefinitionNode &#124; SchemaDefinitionNode &#124; object &#124; ScalarTypeExtensionNode &#124; ObjectTypeExtensionNode &#124; InterfaceTypeExtensionNode &#124; UnionTypeExtensionNode &#124; EnumTypeExtensionNode &#124; InputObjectTypeExtensionNode› |

**Returns:** *[FragmentDefinitionNodeMap](interfaces/fragmentdefinitionnodemap.md) | undefined*

___

###  getInlineFragments

▸ **getInlineFragments**(`__namedParameters`: object): *InlineFragmentNode[]*

*Defined in [packages/helpers/src/parsing/inline-fragments/index.ts:30](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/inline-fragments/index.ts#L30)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`selectionSet` | undefined &#124; SelectionSetNode |

**Returns:** *InlineFragmentNode[]*

___

###  getKind

▸ **getKind**(`__namedParameters`: object): *string*

*Defined in [packages/helpers/src/parsing/kind/index.ts:3](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/kind/index.ts#L3)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`kind` | "Document" &#124; "Field" &#124; "FragmentDefinition" &#124; "FragmentSpread" &#124; "InlineFragment" &#124; "ListValue" &#124; "ObjectValue" &#124; "OperationDefinition" &#124; "Variable" &#124; "VariableDefinition" &#124; "Argument" &#124; "ObjectField" &#124; "Directive" &#124; "NamedType" &#124; "ScalarTypeDefinition" &#124; "ObjectTypeDefinition" &#124; "FieldDefinition" &#124; "InputValueDefinition" &#124; "InterfaceTypeDefinition" &#124; "UnionTypeDefinition" &#124; "EnumTypeDefinition" &#124; "EnumValueDefinition" &#124; "InputObjectTypeDefinition" &#124; "DirectiveDefinition" &#124; "IntValue" &#124; "FloatValue" &#124; "StringValue" &#124; "BooleanValue" &#124; "EnumValue" &#124; "Name" &#124; "NullValue" &#124; "SelectionSet" &#124; "ListType" &#124; "NonNullType" &#124; "SchemaDefinition" &#124; "OperationTypeDefinition" &#124; "SchemaExtension" &#124; "ScalarTypeExtension" &#124; "ObjectTypeExtension" &#124; "InterfaceTypeExtension" &#124; "UnionTypeExtension" &#124; "EnumTypeExtension" &#124; "InputObjectTypeExtension" |

**Returns:** *string*

___

###  getName

▸ **getName**(`node`: ASTNode): *string | undefined*

*Defined in [packages/helpers/src/parsing/name/index.ts:5](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/name/index.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | ASTNode |

**Returns:** *string | undefined*

___

###  getOperationDefinitions

▸ **getOperationDefinitions**(`__namedParameters`: object, `name?`: undefined | string): *OperationDefinitionNode[]*

*Defined in [packages/helpers/src/parsing/operation-definitions/index.ts:5](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/operation-definitions/index.ts#L5)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`definitions` | ReadonlyArray‹FragmentDefinitionNode &#124; OperationDefinitionNode &#124; ScalarTypeDefinitionNode &#124; ObjectTypeDefinitionNode &#124; InterfaceTypeDefinitionNode &#124; UnionTypeDefinitionNode &#124; EnumTypeDefinitionNode &#124; InputObjectTypeDefinitionNode &#124; DirectiveDefinitionNode &#124; SchemaDefinitionNode &#124; object &#124; ScalarTypeExtensionNode &#124; ObjectTypeExtensionNode &#124; InterfaceTypeExtensionNode &#124; UnionTypeExtensionNode &#124; EnumTypeExtensionNode &#124; InputObjectTypeExtensionNode› |

▪`Optional`  **name**: *undefined | string*

**Returns:** *OperationDefinitionNode[]*

___

###  getType

▸ **getType**(`__namedParameters`: object): *GraphQLOutputType*

*Defined in [packages/helpers/src/parsing/type/index.ts:12](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/type/index.ts#L12)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`type` | GraphQLScalarType‹› &#124; GraphQLInterfaceType‹› &#124; GraphQLUnionType‹› &#124; GraphQLEnumType‹› &#124; GraphQLObjectType‹any, any, object› &#124; GraphQLList‹any› &#124; GraphQLNonNull‹GraphQLScalarType‹› &#124; GraphQLInterfaceType‹› &#124; GraphQLUnionType‹› &#124; GraphQLEnumType‹› &#124; GraphQLObjectType‹any, any, object› &#124; GraphQLList‹any›› |

**Returns:** *GraphQLOutputType*

___

###  getTypeCondition

▸ **getTypeCondition**(`__namedParameters`: object): *NamedTypeNode | undefined*

*Defined in [packages/helpers/src/parsing/type-condition/index.ts:3](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/type-condition/index.ts#L3)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`typeCondition` | undefined &#124; NamedTypeNode |

**Returns:** *NamedTypeNode | undefined*

___

###  getVariableDefinitionDefaultValue

▸ **getVariableDefinitionDefaultValue**(`__namedParameters`: object): *any*

*Defined in [packages/helpers/src/parsing/variable-definitions/index.ts:33](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/variable-definitions/index.ts#L33)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`defaultValue` | undefined &#124; VariableNode &#124; IntValueNode &#124; FloatValueNode &#124; StringValueNode &#124; BooleanValueNode &#124; EnumValueNode &#124; NullValueNode &#124; ListValueNode &#124; ObjectValueNode |

**Returns:** *any*

___

###  getVariableDefinitionType

▸ **getVariableDefinitionType**(`__namedParameters`: object): *string*

*Defined in [packages/helpers/src/parsing/variable-definitions/index.ts:55](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/variable-definitions/index.ts#L55)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`type` | NamedTypeNode &#124; ListTypeNode &#124; NonNullTypeNode |

**Returns:** *string*

___

###  hasChildFields

▸ **hasChildFields**(`node`: [ParentNode](README.md#parentnode), `name?`: undefined | string): *boolean*

*Defined in [packages/helpers/src/parsing/child-fields/index.ts:80](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/child-fields/index.ts#L80)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [ParentNode](README.md#parentnode) |
`name?` | undefined &#124; string |

**Returns:** *boolean*

___

###  hasFragmentDefinitions

▸ **hasFragmentDefinitions**(`__namedParameters`: object): *boolean*

*Defined in [packages/helpers/src/parsing/fragment-definitions/index.ts:40](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/fragment-definitions/index.ts#L40)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`definitions` | ReadonlyArray‹FragmentDefinitionNode &#124; OperationDefinitionNode &#124; ScalarTypeDefinitionNode &#124; ObjectTypeDefinitionNode &#124; InterfaceTypeDefinitionNode &#124; UnionTypeDefinitionNode &#124; EnumTypeDefinitionNode &#124; InputObjectTypeDefinitionNode &#124; DirectiveDefinitionNode &#124; SchemaDefinitionNode &#124; object &#124; ScalarTypeExtensionNode &#124; ObjectTypeExtensionNode &#124; InterfaceTypeExtensionNode &#124; UnionTypeExtensionNode &#124; EnumTypeExtensionNode &#124; InputObjectTypeExtensionNode› |

**Returns:** *boolean*

___

###  hasFragmentSpreads

▸ **hasFragmentSpreads**(`__namedParameters`: object): *boolean*

*Defined in [packages/helpers/src/parsing/fragment-spreads/index.ts:5](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/fragment-spreads/index.ts#L5)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`selectionSet` | undefined &#124; SelectionSetNode |

**Returns:** *boolean*

___

###  hasInlineFragments

▸ **hasInlineFragments**(`__namedParameters`: object): *boolean*

*Defined in [packages/helpers/src/parsing/inline-fragments/index.ts:48](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/inline-fragments/index.ts#L48)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`selectionSet` | undefined &#124; SelectionSetNode |

**Returns:** *boolean*

___

###  hasVariableDefinitions

▸ **hasVariableDefinitions**(`__namedParameters`: object): *boolean*

*Defined in [packages/helpers/src/parsing/variable-definitions/index.ts:20](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/variable-definitions/index.ts#L20)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`variableDefinitions` | undefined &#124; ReadonlyArray‹VariableDefinitionNode› |

**Returns:** *boolean*

___

###  hashRequest

▸ **hashRequest**(`value`: string): *string*

*Defined in [packages/helpers/src/hash-request/index.ts:3](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/hash-request/index.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *string*

___

###  iterateChildFields

▸ **iterateChildFields**(`field`: FieldNode, `data`: PlainObjectMap | any[], `callback`: function): *void*

*Defined in [packages/helpers/src/parsing/child-fields/index.ts:89](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/child-fields/index.ts#L89)*

**Parameters:**

▪ **field**: *FieldNode*

▪ **data**: *PlainObjectMap | any[]*

▪ **callback**: *function*

▸ (`childField`: FieldNode, `inlineFragmentType`: string | undefined, `childIndex?`: undefined | number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`childField` | FieldNode |
`inlineFragmentType` | string &#124; undefined |
`childIndex?` | undefined &#124; number |

**Returns:** *void*

___

###  mergeObjects

▸ **mergeObjects**‹**T**›(`obj`: T, `src`: T, `matcher`: function): *T*

*Defined in [packages/helpers/src/merge-objects/index.ts:3](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/merge-objects/index.ts#L3)*

**Type parameters:**

▪ **T**

**Parameters:**

▪ **obj**: *T*

▪ **src**: *T*

▪ **matcher**: *function*

▸ (`key`: string, `value`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *T*

___

###  parseValue

▸ **parseValue**(`valueNode`: ValueNode): *[ParseValueResult](README.md#parsevalueresult)*

*Defined in [packages/helpers/src/parsing/arguments/index.ts:8](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/arguments/index.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`valueNode` | ValueNode |

**Returns:** *[ParseValueResult](README.md#parsevalueresult)*

___

###  rehydrateCacheMetadata

▸ **rehydrateCacheMetadata**(`dehydratedCacheMetadata`: DehydratedCacheMetadata, `cacheMetadata`: CacheMetadata): *CacheMetadata*

*Defined in [packages/helpers/src/cache-metadata/index.ts:14](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/cache-metadata/index.ts#L14)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dehydratedCacheMetadata` | DehydratedCacheMetadata | - |
`cacheMetadata` | CacheMetadata | new Map() |

**Returns:** *CacheMetadata*

___

###  setFragmentDefinitions

▸ **setFragmentDefinitions**(`fragmentDefinitions`: [FragmentDefinitionNodeMap](interfaces/fragmentdefinitionnodemap.md), `node`: FieldNode): *void*

*Defined in [packages/helpers/src/parsing/fragment-definitions/index.ts:44](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/fragment-definitions/index.ts#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`fragmentDefinitions` | [FragmentDefinitionNodeMap](interfaces/fragmentdefinitionnodemap.md) |
`node` | FieldNode |

**Returns:** *void*

___

###  setInlineFragments

▸ **setInlineFragments**(`__namedParameters`: object): *void*

*Defined in [packages/helpers/src/parsing/inline-fragments/index.ts:53](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/inline-fragments/index.ts#L53)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`selectionSet` | undefined &#124; SelectionSetNode |

**Returns:** *void*

___

###  unwrapInlineFragments

▸ **unwrapInlineFragments**(`selectionNodes`: ReadonlyArray‹SelectionNode›, `maxDepth`: number, `depth`: number, `typeName?`: undefined | string): *[FieldAndTypeName](interfaces/fieldandtypename.md)[]*

*Defined in [packages/helpers/src/parsing/inline-fragments/index.ts:72](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/inline-fragments/index.ts#L72)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`selectionNodes` | ReadonlyArray‹SelectionNode› | - |
`maxDepth` | number | 1 |
`depth` | number | 0 |
`typeName?` | undefined &#124; string | - |

**Returns:** *[FieldAndTypeName](interfaces/fieldandtypename.md)[]*

___

###  unwrapOfType

▸ **unwrapOfType**(`type`: GraphQLOutputType): *GraphQLOutputType*

*Defined in [packages/helpers/src/parsing/type/index.ts:5](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/type/index.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | GraphQLOutputType |

**Returns:** *GraphQLOutputType*

___

###  variableDefinitionTypeVisitor

▸ **variableDefinitionTypeVisitor**(`node`: TypeNode): *NamedTypeNode*

*Defined in [packages/helpers/src/parsing/variable-definitions/index.ts:24](https://github.com/badbatch/graphql-box/blob/25fe942/packages/helpers/src/parsing/variable-definitions/index.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | TypeNode |

**Returns:** *NamedTypeNode*
