import { FieldTypeMap, PossibleType, RequestContext, RequestOptions, ValidOperations } from "@graphql-box/core";
import { ParsedDirective } from "@graphql-box/helpers";
import { DocumentNode, FieldNode, GraphQLSchema, IntrospectionQuery } from "graphql";

export interface UserOptions {
  /**
   * Output of an introspection query.
   */
  introspection?: IntrospectionQuery;

  /**
   * The maximum request field depth per request.
   */
  maxFieldDepth?: number;

  /**
   * The maximum type cost per request.
   */
  maxTypeComplexity?: number;

  /**
   * A GraphQL schema.
   */
  schema?: GraphQLSchema;

  /**
   * The cost of requesting a type.
   */
  typeComplexityMap?: Record<string, number>;
}

export interface ClientOptions {
  typeIDKey: string;
}

export type ConstructorOptions = UserOptions & ClientOptions;

export interface UpdateRequestResult {
  ast: DocumentNode;
  request: string;
}

export interface RequestParserDef {
  updateRequest(request: string, options: RequestOptions, context: RequestContext): Promise<UpdateRequestResult>;
}

export type RequestParserInit = (options: ClientOptions) => RequestParserDef;

export interface Ancestors {
  ancestors: readonly any[];
  key: string | number | undefined;
}

export interface MapFieldToTypeData {
  ancestors: ReadonlyArray<any>;
  directives: {
    inherited: string[];
    own: string[];
  };
  fieldNode: FieldNode;
  isEntity: boolean;
  isInterface: boolean;
  isUnion: boolean;
  possibleTypes: PossibleType[];
  typeIDKey: string;
  typeName: string;
}

export type PersistedFragmentSpread = [string, ParsedDirective[], ReadonlyArray<any>];

export interface VisitorContext {
  fieldTypeMap: FieldTypeMap;
  hasDeferOrStream: boolean;
  operation: ValidOperations;
  operationName: string;
  persistedFragmentSpreads: PersistedFragmentSpread[];
}
