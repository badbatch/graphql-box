import { type PlainObject } from '@graphql-box/core';
import {
  type ArgumentNode,
  type BooleanValueNode,
  type DirectiveDefinitionNode,
  type DirectiveNode,
  type EnumTypeDefinitionNode,
  type EnumValueDefinitionNode,
  type EnumValueNode,
  type FieldDefinitionNode,
  type FieldNode,
  type FloatValueNode,
  type FragmentDefinitionNode,
  type FragmentSpreadNode,
  type GraphQLEnumType,
  type GraphQLInterfaceType,
  type GraphQLList,
  type GraphQLObjectType,
  type GraphQLScalarType,
  type GraphQLUnionType,
  type InlineFragmentNode,
  type InputObjectTypeDefinitionNode,
  type InputValueDefinitionNode,
  type IntValueNode,
  type InterfaceTypeDefinitionNode,
  type NamedTypeNode,
  type ObjectFieldNode,
  type ObjectTypeDefinitionNode,
  type OperationDefinitionNode,
  type ScalarTypeDefinitionNode,
  type StringValueNode,
  type UnionTypeDefinitionNode,
  type VariableNode,
} from 'graphql';

export type GraphQLNullableOutputType =
  | GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInterfaceType
  | GraphQLUnionType
  | GraphQLEnumType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export type ParentNode = FieldNode | InlineFragmentNode | OperationDefinitionNode | FragmentDefinitionNode;

export type ScalarValueNode = IntValueNode | FloatValueNode | StringValueNode | BooleanValueNode | EnumValueNode;

export interface FieldAndTypeName {
  fieldNode: FieldNode;
  fragmentKind: string | undefined;
  fragmentName: string | undefined;
  typeName: string | undefined;
}

export interface ParsedDirective {
  args: PlainObject;
  name: string;
  parentKind: string;
  parentName: string;
}

export interface KeysAndPaths {
  hashedRequestFieldCacheKey: string;
  propNameOrIndex: string | number;
  requestFieldCacheKey: string;
  requestFieldPath: string;
  responseDataPath: string;
}

export interface KeysAndPathsOptions {
  index?: number;
  requestFieldCacheKey?: string;
  requestFieldPath?: string;
  responseDataPath?: string;
}
