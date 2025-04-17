import { type AsyncExecutionResult, type PlainObject } from '@graphql-box/core';
import { type ExecutionArgs, type ExecutionResult, type GraphQLFieldResolver, type GraphQLSchema } from 'graphql';
import { type PromiseOrValue } from 'graphql/jsutils/PromiseOrValue.js';

export interface UserOptions {
  /**
   * Set GraphQL context value to be passed on to
   * GraphQL's execute and subscribe methods.
   */
  contextValue?: PlainObject & { data?: PlainObject };
  /**
   * A GraphQL execute function to use
   * instead of the out-of-the-box function.
   */
  execute?: GraphQLExecute;
  /**
   * Set default GraphQL field resolver function to
   * be passed on to GraphQL's execute and subscribe
   * methods.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldResolver?: GraphQLFieldResolver<any, any>;
  /**
   * Set default GraphQL root value to be passed on to
   * GraphQL's execute and subscribe methods.
   */
  rootValue?: unknown;
  /**
   * The GraphQL schema.
   */
  schema: GraphQLSchema;
}

export type GraphQLExecute = (
  args: ExecutionArgs,
) => PromiseOrValue<ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>>;
