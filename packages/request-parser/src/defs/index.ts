import { PossibleType, RequestContext, RequestOptions } from "@handl/core";
import {
  DocumentNode,
  FieldNode,
  FragmentDefinitionNode,
  GraphQLNamedType,
  GraphQLSchema,
  IntrospectionQuery,
} from "graphql";
import Maybe from "graphql/tsutils/Maybe";

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

export interface RequestParserDef {
  updateRequest(
    request: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<UpdateRequestResult>;
}

export type RequestParserInit = (options: ClientOptions) => Promise<RequestParserDef>;

export interface MapFieldToTypeData {
  ancestors: ReadonlyArray<any>;
  fieldNode: FieldNode;
  isEntity: boolean;
  possibleTypes: PossibleType[];
  typeIDKey: string;
  typeName: string;
}
