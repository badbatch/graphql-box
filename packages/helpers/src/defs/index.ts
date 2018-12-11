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
  GraphQLNamedType,
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
import Maybe from "graphql/tsutils/Maybe";

export interface FragmentDefinitionNodeMap {
  [key: string]: FragmentDefinitionNode;
}

export interface VariableTypesMap {
  [key: string]: Maybe<GraphQLNamedType>;
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
