import { type Maybe, type PlainObject, type RequestContext, type RequestOptions } from '@graphql-box/core';
import { type ParsedDirective } from '@graphql-box/helpers';
import {
  type ASTNode,
  type DirectiveNode,
  type DocumentNode,
  type FieldNode,
  type FragmentSpreadNode,
  type GraphQLNamedType,
  type GraphQLSchema,
  type IntrospectionQuery,
} from 'graphql';
import { type Jsonifiable } from 'type-fest';

export type Ancestor = ASTNode | readonly ASTNode[];

export type CalculateIteratorCallbackOptions<T extends Record<string, unknown> = Record<string, unknown>> = {
  fieldArgs?: T | undefined;
  fieldTypeName?: string | undefined;
  isFieldTypeList?: boolean | undefined;
};

export type CalculateIteratorCallback<T extends Record<string, unknown> = Record<string, unknown>> = (
  options: CalculateIteratorCallbackOptions<T>,
) => number | undefined;

export type DirectiveParser<T extends PlainObject<Jsonifiable> = PlainObject<Jsonifiable>> = (
  node: FieldNode | FragmentSpreadNode,
  directive: DirectiveNode,
  variables: T,
  // Return type needs to match the GraphQL return type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any;

export type PathPart = [part: string, count: number] | string;

export type PersistedFragmentSpread = [string, ParsedDirective[], Ancestor[]];

export interface RequestParserDef {
  updateRequest(request: string, options: RequestOptions, context: RequestContext): UpdateRequestResult;
}

export type UpdateRequestResult = {
  ast: DocumentNode;
  hash: string;
  request: string;
};

export type UserOptions = {
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
};

export type VariableTypesMap = Record<string, Maybe<GraphQLNamedType>>;
