import { Maybe, PossibleType, RequestContext, RequestOptions } from "@graphql-box/core";
import {
  DocumentNode,
  FieldNode,
  FragmentDefinitionNode,
  GraphQLNamedType,
  GraphQLSchema,
  IntrospectionQuery,
} from "graphql";

export interface FragmentDefinitionNodeMap {
  [key: string]: FragmentDefinitionNode;
}

export interface VariableTypesMap {
  [key: string]: Maybe<GraphQLNamedType>;
}

export interface UserOptions {
  /**
   * Output of an introspection query.
   */
  introspection?: IntrospectionQuery;

  /**
   * A GraphQL schema.
   */
  schema?: GraphQLSchema;
}

export interface ClientOptions {
  typeIDKey: string;
}

export interface InitOptions {
  introspection?: IntrospectionQuery;
  schema?: GraphQLSchema;
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

export interface RequestParserDef {
  updateRequest(request: string, options: RequestOptions, context: RequestContext): Promise<UpdateRequestResult>;
}

export type RequestParserInit = (options: ClientOptions) => Promise<RequestParserDef>;

export interface MapFieldToTypeData {
  ancestors: ReadonlyArray<any>;
  fieldNode: FieldNode;
  isEntity: boolean;
  isInterface: boolean;
  isUnion: boolean;
  possibleTypes: PossibleType[];
  typeIDKey: string;
  typeName: string;
}
