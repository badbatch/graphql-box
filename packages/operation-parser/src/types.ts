import { type Maybe, type OperationContext, type OperationOptions, type PlainObject } from '@graphql-box/core';
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

export type ConnectionInputOptions = {
  after?: string;
  before?: string;
  first?: number;
  last?: number;
};

export type DirectiveParser<T extends PlainObject<Jsonifiable> = PlainObject<Jsonifiable>> = (
  node: FieldNode | FragmentSpreadNode,
  directive: DirectiveNode,
  variables: T,
  // Return type needs to match the GraphQL return type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any;

export type PathPart = [part: string, count: number] | string;

export interface OperationParserDef {
  update(operation: string, options: OperationOptions, context: OperationContext): UpdateOperationResult;
}

export type UpdateOperationResult = {
  ast: DocumentNode;
  hash: string;
  operation: string;
};

export type UserOptions = {
  /**
   * Output of an introspection query.
   */
  introspection?: IntrospectionQuery;
  /**
   * The maximum operation field depth per operation.
   */
  maxFieldDepth?: number;
  /**
   * The maximum type cost per operation.
   */
  maxTypeComplexity?: number;
  /**
   * A GraphQL schema.
   */
  schema?: GraphQLSchema;
  /**
   * The cost of including a type in an operation.
   */
  typeComplexityMap?: Record<string, number>;
};

export type VariableTypesMap = Record<string, Maybe<GraphQLNamedType>>;
