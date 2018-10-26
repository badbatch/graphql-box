import { coreDefs } from "@handl/core";
import {
  ArgumentNode,
  BooleanValueNode,
  DirectiveDefinitionNode,
  DirectiveNode,
  DocumentNode,
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
  GraphQLSchema,
  GraphQLUnionType,
  InlineFragmentNode,
  InputObjectTypeDefinitionNode,
  InputValueDefinitionNode,
  InterfaceTypeDefinitionNode,
  IntrospectionQuery,
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

export interface UserOptions {
  /**
   * Output of an introspection query.
   */
  introspection: IntrospectionQuery;
}

export interface ClientOptions {
  typeIDKey: string;
}

export interface InitOptions {
  introspection: IntrospectionQuery;
  typeIDKey: string;
}

export interface ConstructorOptions {
  schema: GraphQLSchema;
  typeIDKey: string;
}

export interface UpdateRequestResult {
  ast: DocumentNode;
  request: string;
}

export interface RequestParser {
  updateRequest(
    request: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<UpdateRequestResult>;
}

export type RequestParserInit = (options: ClientOptions) => Promise<RequestParser>;

export interface MapFieldToTypeData {
  ancestors: ReadonlyArray<any>;
  fieldNode: FieldNode;
  isEntity: boolean;
  typeIDKey: string;
  typeName: string;
}
