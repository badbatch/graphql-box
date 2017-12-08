import {
  ArgumentNode,
  BooleanValueNode,
  DirectiveDefinitionNode,
  DirectiveNode,
  EnumTypeDefinitionNode,
  EnumValueDefinitionNode,
  EnumValueNode,
  FieldDefinitionNode,
  FieldNode,
  FloatValueNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
  InlineFragmentNode,
  InputObjectTypeDefinitionNode,
  InputValueDefinitionNode,
  InterfaceTypeDefinitionNode,
  IntValueNode,
  NamedTypeNode,
  ObjectFieldNode,
  ObjectTypeDefinitionNode,
  OperationDefinitionNode,
  ScalarTypeDefinitionNode,
  StringValueNode,
  UnionTypeDefinitionNode,
  VariableNode,
} from "graphql";

export interface FragmentDefinitionNodeMap {
  [key: string]: FragmentDefinitionNode;
}

export type GraphQLNullableOutputType =
  | GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInterfaceType
  | GraphQLUnionType
  | GraphQLEnumType
  | GraphQLList<any>;

export type NamedASTNode =
  | OperationDefinitionNode
  | VariableNode
  | FieldNode
  | ArgumentNode
  | FragmentSpreadNode
  | FragmentDefinitionNode
  | ObjectFieldNode
  | DirectiveNode
  | NamedTypeNode
  | ScalarTypeDefinitionNode
  | ObjectTypeDefinitionNode
  | FieldDefinitionNode
  | InputValueDefinitionNode
  | InterfaceTypeDefinitionNode
  | UnionTypeDefinitionNode
  | EnumTypeDefinitionNode
  | EnumValueDefinitionNode
  | InputObjectTypeDefinitionNode
  | DirectiveDefinitionNode;

export type ParentNode =
  | FieldNode
  | InlineFragmentNode
  | OperationDefinitionNode
  | FragmentDefinitionNode;

export type ScalarValueNode =
  | IntValueNode
  | FloatValueNode
  | StringValueNode
  | BooleanValueNode
  | EnumValueNode;
