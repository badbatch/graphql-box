import {
  ArgumentNode,
  DirectiveDefinitionNode,
  DirectiveNode,
  EnumTypeDefinitionNode,
  EnumValueDefinitionNode,
  FieldDefinitionNode,
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  InputObjectTypeDefinitionNode,
  InputValueDefinitionNode,
  InterfaceTypeDefinitionNode,
  NamedTypeNode,
  ObjectFieldNode,
  ObjectTypeDefinitionNode,
  OperationDefinitionNode,
  ScalarTypeDefinitionNode,
  UnionTypeDefinitionNode,
  VariableNode,
} from "graphql";

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

export interface FragmentDefinitionNodeMap {
  [key: string]: FragmentDefinitionNode;
}
