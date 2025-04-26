import { type Maybe, type PlainObject } from '@graphql-box/core';
import {
  type DocumentNode,
  type ExecutionArgs,
  type ExecutionResult,
  type GraphQLFieldResolver,
  type GraphQLSchema,
} from 'graphql';

export interface UserOptions {
  /**
   * Set GraphQL context value to be passed on to
   * GraphQL's execute and subscribe methods.
   */
  contextValue?: PlainObject & { data?: PlainObject };

  /**
   * Set default GraphQL field resolver function to
   * be passed on to GraphQL's execute and subscribe
   * methods.
   */
  fieldResolver?: GraphQLFieldResolver<unknown, unknown>;

  /**
   * Set default GraphQL root value to be passed on to
   * GraphQL's execute and subscribe methods.
   */
  rootValue?: unknown;

  /**
   * The GraphQL schema.
   */
  schema: GraphQLSchema;

  /**
   * A GraphQL subscribe function to use
   * instead of the out-of-the-box function.
   */
  subscribe?: GraphQLSubscribe;

  /**
   * Set default GraphQL subscribe field resolver function.
   */
  subscribeFieldResolver?: GraphQLFieldResolver<unknown, unknown>;
}

export type GraphQLSubscribe = <TData = PlainObject>(args: {
  contextValue?: unknown;
  document: DocumentNode;
  fieldResolver?: Maybe<GraphQLFieldResolver<unknown, unknown>>;
  operationName?: Maybe<string>;
  rootValue?: unknown;
  schema: GraphQLSchema;
  subscribeFieldResolver?: Maybe<GraphQLFieldResolver<unknown, unknown>>;
  variableValues?: Maybe<Record<string, unknown>>;
}) => Promise<AsyncIterator<ExecutionResult<TData>> | ExecutionResult<TData>>;

export interface SubscribeArgs extends ExecutionArgs {
  subscribeFieldResolver?: Maybe<GraphQLFieldResolver<unknown, unknown>>;
}
