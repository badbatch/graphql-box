import { type Maybe, type OperationContext, type OperationData, type OperationOptions } from '@graphql-box/core';
import { type ASTNode, type GraphQLNamedType, type GraphQLSchema, type IntrospectionQuery } from 'graphql';

export type Ancestor = ASTNode | readonly ASTNode[];

export type ConnectionInputOptions = {
  after?: string;
  before?: string;
  first?: number;
  last?: number;
};

export type PathPart = [part: string, count: number] | string;

export interface OperationParserDef {
  buildOperationData(operation: string, options: OperationOptions, context: OperationContext): OperationData;
}

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
