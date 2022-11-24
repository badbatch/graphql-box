import { PlainObjectMap } from "@graphql-box/core";
import { ExecutionResult, GraphQLFieldResolver, GraphQLSchema } from "graphql";
import { ExecutionArgs } from "graphql/execution/execute";
import { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";

export interface UserOptions {
  /**
   * Set GraphQL context value to be passed on to
   * GraphQL's execute and subscribe methods.
   */
  contextValue?: PlainObjectMap;

  /**
   * Set default GraphQL field resolver function to
   * be passed on to GraphQL's execute and subscribe
   * methods.
   */
  fieldResolver?: GraphQLFieldResolver<any, any>;

  /**
   * Set default GraphQL root value to be passed on to
   * GraphQL's execute and subscribe methods.
   */
  rootValue?: any;

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
  subscribeFieldResolver?: GraphQLFieldResolver<any, any>;
}

export type GraphQLSubscribe = (
  args: ExecutionArgs,
) => PromiseOrValue<AsyncGenerator<ExecutionResult, void, void> | ExecutionResult>;
