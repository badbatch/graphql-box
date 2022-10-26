[Documentation](README.md)

# Documentation

## Index

### Classes

* [EventAsyncIterator](classes/eventasynciterator.md)

### Interfaces

* [FieldAndTypeName](interfaces/fieldandtypename.md)
* [KeysAndPaths](interfaces/keysandpaths.md)
* [KeysAndPathsOptions](interfaces/keysandpathsoptions.md)
* [ParsedDirective](interfaces/parseddirective.md)

### Type aliases

* [ChildFieldOptions](README.md#childfieldoptions)
* [GraphQLNullableOutputType](README.md#graphqlnullableoutputtype)
* [NamedASTNode](README.md#namedastnode)
* [Params](README.md#params)
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
* [buildFieldKeysAndPaths](README.md#const-buildfieldkeysandpaths)
* [buildKey](README.md#const-buildkey)
* [buildRequestFieldCacheKey](README.md#const-buildrequestfieldcachekey)
* [dehydrateCacheMetadata](README.md#dehydratecachemetadata)
* [deleteChildFields](README.md#deletechildfields)
* [deleteFragmentDefinitions](README.md#deletefragmentdefinitions)
* [deleteFragmentSpreads](README.md#deletefragmentspreads)
* [deleteInlineFragments](README.md#deleteinlinefragments)
* [deserializeErrors](README.md#const-deserializeerrors)
* [getAlias](README.md#getalias)
* [getAliasOrName](README.md#const-getaliasorname)
* [getArguments](README.md#getarguments)
* [getChildFields](README.md#getchildfields)
* [getDirectives](README.md#getdirectives)
* [getFieldDirectives](README.md#getfielddirectives)
* [getFragmentDefinitions](README.md#getfragmentdefinitions)
* [getFragmentSpreadDirectives](README.md#getfragmentspreaddirectives)
* [getFragmentSpreads](README.md#getfragmentspreads)
* [getFragmentSpreadsWithoutDirectives](README.md#const-getfragmentspreadswithoutdirectives)
* [getInlineFragmentDirectives](README.md#getinlinefragmentdirectives)
* [getInlineFragments](README.md#getinlinefragments)
* [getKind](README.md#getkind)
* [getName](README.md#getname)
* [getOperationDefinitions](README.md#getoperationdefinitions)
* [getType](README.md#gettype)
* [getTypeCondition](README.md#gettypecondition)
* [getVariableDefinitionDefaultValue](README.md#getvariabledefinitiondefaultvalue)
* [getVariableDefinitionType](README.md#getvariabledefinitiontype)
* [hasChildFields](README.md#haschildfields)
* [hasFragmentSpreads](README.md#hasfragmentspreads)
* [hasInlineFragments](README.md#hasinlinefragments)
* [hashRequest](README.md#hashrequest)
* [isKind](README.md#iskind)
* [iterateChildFields](README.md#iteratechildfields)
* [mergeObjects](README.md#mergeobjects)
* [parseDirectiveArguments](README.md#parsedirectivearguments)
* [parseValue](README.md#parsevalue)
* [rehydrateCacheMetadata](README.md#rehydratecachemetadata)
* [resolveFragmentSpreads](README.md#const-resolvefragmentspreads)
* [resolveFragments](README.md#const-resolvefragments)
* [resolveInlineFragments](README.md#resolveinlinefragments)
* [serializeErrors](README.md#const-serializeerrors)
* [setCacheMetadata](README.md#const-setcachemetadata)
* [setFragmentDefinitions](README.md#const-setfragmentdefinitions)
* [setFragments](README.md#const-setfragments)
* [setInlineFragments](README.md#const-setinlinefragments)
* [unwrapOfType](README.md#unwrapoftype)
* [variableDefinitionTypeVisitor](README.md#variabledefinitiontypevisitor)

## Type aliases

###  ChildFieldOptions

Ƭ **ChildFieldOptions**: *object*

*Defined in [packages/helpers/src/parsing/child-fields/index.ts:70](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/child-fields/index.ts#L70)*

#### Type declaration:

* **fragmentDefinitions**? : *FragmentDefinitionNodeMap*

* **name**? : *undefined | string*

___

###  GraphQLNullableOutputType

Ƭ **GraphQLNullableOutputType**: *GraphQLScalarType | GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType | GraphQLEnumType | GraphQLList‹any›*

*Defined in [packages/helpers/src/defs/index.ts:36](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/defs/index.ts#L36)*

___

###  NamedASTNode

Ƭ **NamedASTNode**: *OperationDefinitionNode | VariableNode | FieldNode | ArgumentNode | FragmentSpreadNode | FragmentDefinitionNode | ObjectFieldNode | DirectiveNode | NamedTypeNode | ScalarTypeDefinitionNode | ObjectTypeDefinitionNode | FieldDefinitionNode | InputValueDefinitionNode | InterfaceTypeDefinitionNode | UnionTypeDefinitionNode | EnumTypeDefinitionNode | EnumValueDefinitionNode | InputObjectTypeDefinitionNode | DirectiveDefinitionNode*

*Defined in [packages/helpers/src/defs/index.ts:44](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/defs/index.ts#L44)*

___

###  Params

Ƭ **Params**: *object*

*Defined in [packages/helpers/src/parsing/fragments/index.ts:71](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/fragments/index.ts#L71)*

#### Type declaration:

* **fragmentDefinitions**: *FragmentDefinitionNodeMap | undefined*

* **node**: *FieldNode | InlineFragmentNode | FragmentDefinitionNode*

* **type**: *GraphQLOutputType | GraphQLNamedType*

___

###  ParentNode

Ƭ **ParentNode**: *FieldNode | InlineFragmentNode | OperationDefinitionNode | FragmentDefinitionNode*

*Defined in [packages/helpers/src/defs/index.ts:65](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/defs/index.ts#L65)*

___

###  ParseValueResult

Ƭ **ParseValueResult**: *string | boolean | null | PlainObjectMap | any[]*

*Defined in [packages/helpers/src/parsing/arguments/index.ts:8](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/arguments/index.ts#L8)*

___

###  ScalarValueNode

Ƭ **ScalarValueNode**: *IntValueNode | FloatValueNode | StringValueNode | BooleanValueNode | EnumValueNode*

*Defined in [packages/helpers/src/defs/index.ts:67](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/defs/index.ts#L67)*

## Variables

### `Const` DOCUMENT

• **DOCUMENT**: *"Document"* = "Document"

*Defined in [packages/helpers/src/consts/index.ts:1](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/consts/index.ts#L1)*

___

### `Const` FIELD

• **FIELD**: *"Field"* = "Field"

*Defined in [packages/helpers/src/consts/index.ts:2](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/consts/index.ts#L2)*

___

### `Const` FRAGMENT_DEFINITION

• **FRAGMENT_DEFINITION**: *"FragmentDefinition"* = "FragmentDefinition"

*Defined in [packages/helpers/src/consts/index.ts:3](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/consts/index.ts#L3)*

___

### `Const` FRAGMENT_SPREAD

• **FRAGMENT_SPREAD**: *"FragmentSpread"* = "FragmentSpread"

*Defined in [packages/helpers/src/consts/index.ts:4](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/consts/index.ts#L4)*

___

### `Const` INLINE_FRAGMENT

• **INLINE_FRAGMENT**: *"InlineFragment"* = "InlineFragment"

*Defined in [packages/helpers/src/consts/index.ts:5](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/consts/index.ts#L5)*

___

### `Const` LIST_VALUE

• **LIST_VALUE**: *"ListValue"* = "ListValue"

*Defined in [packages/helpers/src/consts/index.ts:6](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/consts/index.ts#L6)*

___

### `Const` NAME

• **NAME**: *"name"* = "name"

*Defined in [packages/helpers/src/consts/index.ts:7](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/consts/index.ts#L7)*

___

### `Const` OBJECT_VALUE

• **OBJECT_VALUE**: *"ObjectValue"* = "ObjectValue"

*Defined in [packages/helpers/src/consts/index.ts:8](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/consts/index.ts#L8)*

___

### `Const` OF_TYPE

• **OF_TYPE**: *"ofType"* = "ofType"

*Defined in [packages/helpers/src/consts/index.ts:9](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/consts/index.ts#L9)*

___

### `Const` OPERATION_DEFINITION

• **OPERATION_DEFINITION**: *"OperationDefinition"* = "OperationDefinition"

*Defined in [packages/helpers/src/consts/index.ts:10](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/consts/index.ts#L10)*

___

### `Const` STRING

• **STRING**: *"String"* = "String"

*Defined in [packages/helpers/src/consts/index.ts:11](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/consts/index.ts#L11)*

___

### `Const` TYPE

• **TYPE**: *"type"* = "type"

*Defined in [packages/helpers/src/consts/index.ts:12](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/consts/index.ts#L12)*

___

### `Const` VALUE

• **VALUE**: *"value"* = "value"

*Defined in [packages/helpers/src/consts/index.ts:13](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/consts/index.ts#L13)*

___

### `Const` VARIABLE

• **VARIABLE**: *"Variable"* = "Variable"

*Defined in [packages/helpers/src/consts/index.ts:14](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/consts/index.ts#L14)*

___

### `Const` VARIABLE_DEFINITION

• **VARIABLE_DEFINITION**: *"VariableDefinition"* = "VariableDefinition"

*Defined in [packages/helpers/src/consts/index.ts:15](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/consts/index.ts#L15)*

## Functions

###  addChildField

▸ **addChildField**(`node`: [ParentNode](README.md#parentnode), `field`: FieldNode, `schema`: GraphQLSchema, `typeIDKey`: string): *void*

*Defined in [packages/helpers/src/parsing/child-fields/index.ts:10](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/child-fields/index.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [ParentNode](README.md#parentnode) |
`field` | FieldNode |
`schema` | GraphQLSchema |
`typeIDKey` | string |

**Returns:** *void*

___

### `Const` buildFieldKeysAndPaths

▸ **buildFieldKeysAndPaths**(`field`: FieldNode, `options`: [KeysAndPathsOptions](interfaces/keysandpathsoptions.md), `context`: RequestContext): *[KeysAndPaths](interfaces/keysandpaths.md)*

*Defined in [packages/helpers/src/buildKeysAndPaths/index.ts:45](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/buildKeysAndPaths/index.ts#L45)*

**Parameters:**

Name | Type |
------ | ------ |
`field` | FieldNode |
`options` | [KeysAndPathsOptions](interfaces/keysandpathsoptions.md) |
`context` | RequestContext |

**Returns:** *[KeysAndPaths](interfaces/keysandpaths.md)*

___

### `Const` buildKey

▸ **buildKey**(`path`: string, `key`: string | number): *string*

*Defined in [packages/helpers/src/buildKeysAndPaths/index.ts:10](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/buildKeysAndPaths/index.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |
`key` | string &#124; number |

**Returns:** *string*

___

### `Const` buildRequestFieldCacheKey

▸ **buildRequestFieldCacheKey**(`name`: string, `requestFieldCacheKey`: string, `args`: PlainObjectMap | undefined, `directives?`: FieldTypeInfo["directives"], `index?`: undefined | number): *string*

*Defined in [packages/helpers/src/buildKeysAndPaths/index.ts:21](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/buildKeysAndPaths/index.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`requestFieldCacheKey` | string |
`args` | PlainObjectMap &#124; undefined |
`directives?` | FieldTypeInfo["directives"] |
`index?` | undefined &#124; number |

**Returns:** *string*

___

###  dehydrateCacheMetadata

▸ **dehydrateCacheMetadata**(`cacheMetadata`: CacheMetadata): *DehydratedCacheMetadata*

*Defined in [packages/helpers/src/cache-metadata/index.ts:4](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/cache-metadata/index.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`cacheMetadata` | CacheMetadata |

**Returns:** *DehydratedCacheMetadata*

___

###  deleteChildFields

▸ **deleteChildFields**(`node`: [ParentNode](README.md#parentnode), `fields`: FieldNode[] | FieldNode): *void*

*Defined in [packages/helpers/src/parsing/child-fields/index.ts:47](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/child-fields/index.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [ParentNode](README.md#parentnode) |
`fields` | FieldNode[] &#124; FieldNode |

**Returns:** *void*

___

###  deleteFragmentDefinitions

▸ **deleteFragmentDefinitions**(`documentNode`: DocumentNode, `__namedParameters`: object): *any*

*Defined in [packages/helpers/src/parsing/fragment-definitions/index.ts:8](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/fragment-definitions/index.ts#L8)*

**Parameters:**

▪ **documentNode**: *DocumentNode*

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type | Default |
------ | ------ | ------ |
`exclude` | string[] | [] |
`include` | string[] | [] |

**Returns:** *any*

___

###  deleteFragmentSpreads

▸ **deleteFragmentSpreads**(`node`: [ParentNode](README.md#parentnode), `spreadNames`: string[] | string): *void*

*Defined in [packages/helpers/src/parsing/fragment-spreads/index.ts:17](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/fragment-spreads/index.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [ParentNode](README.md#parentnode) |
`spreadNames` | string[] &#124; string |

**Returns:** *void*

___

###  deleteInlineFragments

▸ **deleteInlineFragments**(`node`: [ParentNode](README.md#parentnode), `inlineFragments`: InlineFragmentNode[] | InlineFragmentNode): *void*

*Defined in [packages/helpers/src/parsing/inline-fragments/index.ts:16](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/inline-fragments/index.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [ParentNode](README.md#parentnode) |
`inlineFragments` | InlineFragmentNode[] &#124; InlineFragmentNode |

**Returns:** *void*

___

### `Const` deserializeErrors

▸ **deserializeErrors**‹**Type**›(`__namedParameters`: object): *object*

*Defined in [packages/helpers/src/serializeErrors/index.ts:3](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/serializeErrors/index.ts#L3)*

**Type parameters:**

▪ **Type**: *object*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`errors` | undefined &#124; object & object[] |
`rest` | object |

**Returns:** *object*

___

###  getAlias

▸ **getAlias**(`__namedParameters`: object): *string | undefined*

*Defined in [packages/helpers/src/parsing/alias/index.ts:3](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/alias/index.ts#L3)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`alias` | any |

**Returns:** *string | undefined*

___

### `Const` getAliasOrName

▸ **getAliasOrName**(`field`: FieldNode): *any*

*Defined in [packages/helpers/src/parsing/alias-or-name/index.ts:5](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/alias-or-name/index.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`field` | FieldNode |

**Returns:** *any*

___

###  getArguments

▸ **getArguments**(`field`: FieldNode | DirectiveNode, `options?`: RequestOptions): *PlainObjectMap | undefined*

*Defined in [packages/helpers/src/parsing/arguments/index.ts:41](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/arguments/index.ts#L41)*

**Parameters:**

Name | Type |
------ | ------ |
`field` | FieldNode &#124; DirectiveNode |
`options?` | RequestOptions |

**Returns:** *PlainObjectMap | undefined*

___

###  getChildFields

▸ **getChildFields**(`node`: [ParentNode](README.md#parentnode), `__namedParameters`: object): *[FieldAndTypeName](interfaces/fieldandtypename.md)[] | undefined*

*Defined in [packages/helpers/src/parsing/child-fields/index.ts:75](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/child-fields/index.ts#L75)*

**Parameters:**

▪ **node**: *[ParentNode](README.md#parentnode)*

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type |
------ | ------ |
`fragmentDefinitions` | undefined &#124; FragmentDefinitionNodeMap |
`name` | undefined &#124; string |

**Returns:** *[FieldAndTypeName](interfaces/fieldandtypename.md)[] | undefined*

___

###  getDirectives

▸ **getDirectives**(`field`: FieldNode | InlineFragmentNode, `options?`: RequestOptions): *[ParsedDirective](interfaces/parseddirective.md)[]*

*Defined in [packages/helpers/src/parsing/directives/index.ts:18](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/directives/index.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`field` | FieldNode &#124; InlineFragmentNode |
`options?` | RequestOptions |

**Returns:** *[ParsedDirective](interfaces/parseddirective.md)[]*

___

###  getFieldDirectives

▸ **getFieldDirectives**(`field`: FieldNode, `options?`: RequestOptions): *[ParsedDirective](interfaces/parseddirective.md)[]*

*Defined in [packages/helpers/src/parsing/directives/index.ts:27](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/directives/index.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`field` | FieldNode |
`options?` | RequestOptions |

**Returns:** *[ParsedDirective](interfaces/parseddirective.md)[]*

___

###  getFragmentDefinitions

▸ **getFragmentDefinitions**(`__namedParameters`: object): *FragmentDefinitionNodeMap | undefined*

*Defined in [packages/helpers/src/parsing/fragment-definitions/index.ts:40](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/fragment-definitions/index.ts#L40)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`definitions` | any |

**Returns:** *FragmentDefinitionNodeMap | undefined*

___

###  getFragmentSpreadDirectives

▸ **getFragmentSpreadDirectives**(`field`: FieldNode | InlineFragmentNode | FragmentDefinitionNode, `options?`: RequestOptions): *[ParsedDirective](interfaces/parseddirective.md)[]*

*Defined in [packages/helpers/src/parsing/directives/index.ts:33](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/directives/index.ts#L33)*

**Parameters:**

Name | Type |
------ | ------ |
`field` | FieldNode &#124; InlineFragmentNode &#124; FragmentDefinitionNode |
`options?` | RequestOptions |

**Returns:** *[ParsedDirective](interfaces/parseddirective.md)[]*

___

###  getFragmentSpreads

▸ **getFragmentSpreads**(`fieldNode`: FieldNode | InlineFragmentNode | FragmentDefinitionNode, `__namedParameters`: object): *any[]*

*Defined in [packages/helpers/src/parsing/fragment-spreads/index.ts:49](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/fragment-spreads/index.ts#L49)*

**Parameters:**

▪ **fieldNode**: *FieldNode | InlineFragmentNode | FragmentDefinitionNode*

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type | Default |
------ | ------ | ------ |
`exclude` | string[] | [] |
`include` | string[] | [] |

**Returns:** *any[]*

___

### `Const` getFragmentSpreadsWithoutDirectives

▸ **getFragmentSpreadsWithoutDirectives**(`node`: FieldNode | InlineFragmentNode | FragmentDefinitionNode): *any[]*

*Defined in [packages/helpers/src/parsing/fragment-spreads/index.ts:73](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/fragment-spreads/index.ts#L73)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | FieldNode &#124; InlineFragmentNode &#124; FragmentDefinitionNode |

**Returns:** *any[]*

___

###  getInlineFragmentDirectives

▸ **getInlineFragmentDirectives**(`field`: InlineFragmentNode, `options?`: RequestOptions): *[ParsedDirective](interfaces/parseddirective.md)[]*

*Defined in [packages/helpers/src/parsing/directives/index.ts:61](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/directives/index.ts#L61)*

**Parameters:**

Name | Type |
------ | ------ |
`field` | InlineFragmentNode |
`options?` | RequestOptions |

**Returns:** *[ParsedDirective](interfaces/parseddirective.md)[]*

___

###  getInlineFragments

▸ **getInlineFragments**(`__namedParameters`: object): *any[]*

*Defined in [packages/helpers/src/parsing/inline-fragments/index.ts:35](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/inline-fragments/index.ts#L35)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`selectionSet` | any |

**Returns:** *any[]*

___

###  getKind

▸ **getKind**(`__namedParameters`: object): *string*

*Defined in [packages/helpers/src/parsing/kind/index.ts:3](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/kind/index.ts#L3)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`kind` | any |

**Returns:** *string*

___

###  getName

▸ **getName**(`node`: ASTNode): *any*

*Defined in [packages/helpers/src/parsing/name/index.ts:5](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/name/index.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | ASTNode |

**Returns:** *any*

___

###  getOperationDefinitions

▸ **getOperationDefinitions**(`__namedParameters`: object, `name?`: undefined | string): *OperationDefinitionNode[]*

*Defined in [packages/helpers/src/parsing/operation-definitions/index.ts:5](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/operation-definitions/index.ts#L5)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`definitions` | any |

▪`Optional`  **name**: *undefined | string*

**Returns:** *OperationDefinitionNode[]*

___

###  getType

▸ **getType**(`__namedParameters`: object): *GraphQLOutputType*

*Defined in [packages/helpers/src/parsing/type/index.ts:12](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/type/index.ts#L12)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`type` | any |

**Returns:** *GraphQLOutputType*

___

###  getTypeCondition

▸ **getTypeCondition**(`__namedParameters`: object): *any*

*Defined in [packages/helpers/src/parsing/type-condition/index.ts:3](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/type-condition/index.ts#L3)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`typeCondition` | any |

**Returns:** *any*

___

###  getVariableDefinitionDefaultValue

▸ **getVariableDefinitionDefaultValue**(`__namedParameters`: object): *any*

*Defined in [packages/helpers/src/parsing/variable-definitions/index.ts:15](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/variable-definitions/index.ts#L15)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`defaultValue` | any |

**Returns:** *any*

___

###  getVariableDefinitionType

▸ **getVariableDefinitionType**(`__namedParameters`: object): *string*

*Defined in [packages/helpers/src/parsing/variable-definitions/index.ts:37](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/variable-definitions/index.ts#L37)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`type` | any |

**Returns:** *string*

___

###  hasChildFields

▸ **hasChildFields**(`node`: [ParentNode](README.md#parentnode), `__namedParameters`: object): *boolean*

*Defined in [packages/helpers/src/parsing/child-fields/index.ts:96](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/child-fields/index.ts#L96)*

**Parameters:**

▪ **node**: *[ParentNode](README.md#parentnode)*

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type |
------ | ------ |
`fragmentDefinitions` | undefined &#124; FragmentDefinitionNodeMap |
`name` | undefined &#124; string |

**Returns:** *boolean*

___

###  hasFragmentSpreads

▸ **hasFragmentSpreads**(`__namedParameters`: object): *boolean*

*Defined in [packages/helpers/src/parsing/fragment-spreads/index.ts:42](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/fragment-spreads/index.ts#L42)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`selectionSet` | any |

**Returns:** *boolean*

___

###  hasInlineFragments

▸ **hasInlineFragments**(`__namedParameters`: object): *any*

*Defined in [packages/helpers/src/parsing/inline-fragments/index.ts:55](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/inline-fragments/index.ts#L55)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`selectionSet` | any |

**Returns:** *any*

___

###  hashRequest

▸ **hashRequest**(`value`: string): *string*

*Defined in [packages/helpers/src/hash-request/index.ts:3](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/hash-request/index.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *string*

___

###  isKind

▸ **isKind**‹**T**›(`node`: ASTNode, `name`: string): *node is T*

*Defined in [packages/helpers/src/parsing/kind/index.ts:7](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/kind/index.ts#L7)*

**Type parameters:**

▪ **T**: *ASTNode*

**Parameters:**

Name | Type |
------ | ------ |
`node` | ASTNode |
`name` | string |

**Returns:** *node is T*

___

###  iterateChildFields

▸ **iterateChildFields**(`field`: FieldNode, `data`: PlainObjectMap | any[], `fragmentDefinitions`: FragmentDefinitionNodeMap | undefined, `callback`: function): *void*

*Defined in [packages/helpers/src/parsing/child-fields/index.ts:110](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/child-fields/index.ts#L110)*

**Parameters:**

▪ **field**: *FieldNode*

▪ **data**: *PlainObjectMap | any[]*

▪ **fragmentDefinitions**: *FragmentDefinitionNodeMap | undefined*

▪ **callback**: *function*

▸ (`childField`: FieldNode, `typeName`: string | undefined, `fragmentKind`: string | undefined, `fragmentName`: string | undefined, `childIndex?`: undefined | number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`childField` | FieldNode |
`typeName` | string &#124; undefined |
`fragmentKind` | string &#124; undefined |
`fragmentName` | string &#124; undefined |
`childIndex?` | undefined &#124; number |

**Returns:** *void*

___

###  mergeObjects

▸ **mergeObjects**‹**T**›(`obj`: T, `src`: T, `matcher`: function): *T*

*Defined in [packages/helpers/src/merge-objects/index.ts:3](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/merge-objects/index.ts#L3)*

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

###  parseDirectiveArguments

▸ **parseDirectiveArguments**(`directives`: keyof DirectiveNode[], `name`: string, `kind`: string, `options?`: RequestOptions): *[ParsedDirective](interfaces/parseddirective.md)[]*

*Defined in [packages/helpers/src/parsing/directives/index.ts:72](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/directives/index.ts#L72)*

**Parameters:**

Name | Type |
------ | ------ |
`directives` | keyof DirectiveNode[] |
`name` | string |
`kind` | string |
`options?` | RequestOptions |

**Returns:** *[ParsedDirective](interfaces/parseddirective.md)[]*

___

###  parseValue

▸ **parseValue**(`valueNode`: ValueNode): *[ParseValueResult](README.md#parsevalueresult)*

*Defined in [packages/helpers/src/parsing/arguments/index.ts:10](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/arguments/index.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`valueNode` | ValueNode |

**Returns:** *[ParseValueResult](README.md#parsevalueresult)*

___

###  rehydrateCacheMetadata

▸ **rehydrateCacheMetadata**(`dehydratedCacheMetadata`: DehydratedCacheMetadata, `cacheMetadata`: CacheMetadata): *CacheMetadata*

*Defined in [packages/helpers/src/cache-metadata/index.ts:14](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/cache-metadata/index.ts#L14)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dehydratedCacheMetadata` | DehydratedCacheMetadata | - |
`cacheMetadata` | CacheMetadata | new Map() |

**Returns:** *CacheMetadata*

___

### `Const` resolveFragmentSpreads

▸ **resolveFragmentSpreads**(`selectionNodes`: ReadonlyArray‹SelectionNode›, `fragmentDefinitions`: FragmentDefinitionNodeMap, `maxDepth`: number, `depth`: number, `typeName?`: undefined | string, `fragmentKind?`: undefined | string, `fragmentName?`: undefined | string): *[FieldAndTypeName](interfaces/fieldandtypename.md)[]*

*Defined in [packages/helpers/src/parsing/fragment-spreads/index.ts:85](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/fragment-spreads/index.ts#L85)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`selectionNodes` | ReadonlyArray‹SelectionNode› | - |
`fragmentDefinitions` | FragmentDefinitionNodeMap | - |
`maxDepth` | number | 1 |
`depth` | number | 0 |
`typeName?` | undefined &#124; string | - |
`fragmentKind?` | undefined &#124; string | - |
`fragmentName?` | undefined &#124; string | - |

**Returns:** *[FieldAndTypeName](interfaces/fieldandtypename.md)[]*

___

### `Const` resolveFragments

▸ **resolveFragments**(`selectionNodes`: ReadonlyArray‹SelectionNode›, `fragmentDefinitions`: FragmentDefinitionNodeMap, `typeName?`: undefined | string, `fragmentKind?`: undefined | string, `fragmentName?`: undefined | string): *[FieldAndTypeName](interfaces/fieldandtypename.md)[]*

*Defined in [packages/helpers/src/parsing/fragments/index.ts:23](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/fragments/index.ts#L23)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`selectionNodes` | ReadonlyArray‹SelectionNode› | - |
`fragmentDefinitions` | FragmentDefinitionNodeMap | {} |
`typeName?` | undefined &#124; string | - |
`fragmentKind?` | undefined &#124; string | - |
`fragmentName?` | undefined &#124; string | - |

**Returns:** *[FieldAndTypeName](interfaces/fieldandtypename.md)[]*

___

###  resolveInlineFragments

▸ **resolveInlineFragments**(`selectionNodes`: ReadonlyArray‹SelectionNode›, `maxDepth`: number, `depth`: number, `typeName?`: undefined | string, `fragmentKind?`: undefined | string): *[FieldAndTypeName](interfaces/fieldandtypename.md)[]*

*Defined in [packages/helpers/src/parsing/inline-fragments/index.ts:60](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/inline-fragments/index.ts#L60)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`selectionNodes` | ReadonlyArray‹SelectionNode› | - |
`maxDepth` | number | 1 |
`depth` | number | 0 |
`typeName?` | undefined &#124; string | - |
`fragmentKind?` | undefined &#124; string | - |

**Returns:** *[FieldAndTypeName](interfaces/fieldandtypename.md)[]*

___

### `Const` serializeErrors

▸ **serializeErrors**‹**Type**›(`__namedParameters`: object): *object*

*Defined in [packages/helpers/src/serializeErrors/index.ts:14](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/serializeErrors/index.ts#L14)*

**Type parameters:**

▪ **Type**: *object*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`errors` | undefined &#124; Error[] &#124; ReadonlyArray‹Error› |
`rest` | object |

**Returns:** *object*

___

### `Const` setCacheMetadata

▸ **setCacheMetadata**(`cacheMetadata`: DehydratedCacheMetadata): *(Anonymous function)*

*Defined in [packages/helpers/src/cache-metadata/index.ts:25](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/cache-metadata/index.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`cacheMetadata` | DehydratedCacheMetadata |

**Returns:** *(Anonymous function)*

___

### `Const` setFragmentDefinitions

▸ **setFragmentDefinitions**(`fragmentDefinitions`: FragmentDefinitionNodeMap, `node`: FieldNode | InlineFragmentNode | FragmentDefinitionNode, `__namedParameters`: object): *number*

*Defined in [packages/helpers/src/parsing/fragment-definitions/index.ts:62](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/fragment-definitions/index.ts#L62)*

**Parameters:**

▪ **fragmentDefinitions**: *FragmentDefinitionNodeMap*

▪ **node**: *FieldNode | InlineFragmentNode | FragmentDefinitionNode*

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type | Default |
------ | ------ | ------ |
`exclude` | string[] | [] |
`include` | string[] | [] |

**Returns:** *number*

___

### `Const` setFragments

▸ **setFragments**(`__namedParameters`: object): *void*

*Defined in [packages/helpers/src/parsing/fragments/index.ts:77](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/fragments/index.ts#L77)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`fragmentDefinitions` | undefined &#124; FragmentDefinitionNodeMap |
`node` | any |
`type` | any |

**Returns:** *void*

___

### `Const` setInlineFragments

▸ **setInlineFragments**(`__namedParameters`: object, `__namedParameters`: object): *number*

*Defined in [packages/helpers/src/parsing/inline-fragments/index.ts:92](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/inline-fragments/index.ts#L92)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`selectionSet` | any |

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type | Default |
------ | ------ | ------ |
`exclude` | string[] | [] |
`include` | string[] | [] |

**Returns:** *number*

___

###  unwrapOfType

▸ **unwrapOfType**(`type`: GraphQLOutputType): *GraphQLOutputType*

*Defined in [packages/helpers/src/parsing/type/index.ts:5](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/type/index.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | GraphQLOutputType |

**Returns:** *GraphQLOutputType*

___

###  variableDefinitionTypeVisitor

▸ **variableDefinitionTypeVisitor**(`node`: TypeNode): *NamedTypeNode*

*Defined in [packages/helpers/src/parsing/variable-definitions/index.ts:6](https://github.com/badbatch/graphql-box/blob/a50a8075/packages/helpers/src/parsing/variable-definitions/index.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | TypeNode |

**Returns:** *NamedTypeNode*
