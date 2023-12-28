import { type FieldTypeMap, type PossibleType, type RequestContext, type RequestOptions } from '@graphql-box/core';
import { type ParsedDirective } from '@graphql-box/helpers';
import {
  type ASTNode,
  type DocumentNode,
  type FieldNode,
  type GraphQLSchema,
  type IntrospectionQuery,
  type OperationTypeNode,
} from 'graphql';

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

  /**
   * The name of the property thats value is used as the unique
   * identifier for each type in the GraphQL schema.
   */
  typeIDKey?: string;
}

export interface UpdateRequestResult {
  ast: DocumentNode;
  request: string;
}

export interface RequestParserDef {
  updateRequest(request: string, options: RequestOptions, context: RequestContext): UpdateRequestResult;
}

export type Ancestor = ASTNode | readonly ASTNode[];

export interface Ancestors {
  ancestors: readonly Ancestor[];
  key: string | number | undefined;
}

export interface MapFieldToTypeData {
  ancestors: readonly Ancestor[];
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

export type PersistedFragmentSpread = [string, ParsedDirective[], Ancestor[]];

export interface VisitorContext {
  experimentalDeferStreamSupport: boolean;
  fieldTypeMap: FieldTypeMap;
  hasDeferOrStream: boolean;
  operation: OperationTypeNode;
  operationName: string;
  persistedFragmentSpreads: PersistedFragmentSpread[];
}
