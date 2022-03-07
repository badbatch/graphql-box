import { PlainObjectMap } from "@graphql-box/core";
import { AsyncExecutionResult, ExecutionArgs, ExecutionResult, GraphQLFieldResolver, GraphQLSchema } from "graphql";
import { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";

export interface UserOptions {
  /**
   * Set GraphQL context value to be passed on to
   * GraphQL's execute and subscribe methods.
   */
  contextValue?: PlainObjectMap;

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
}

export type ConstructorOptions = UserOptions;

export type GraphQLExecute = (
  args: ExecutionArgs,
) => PromiseOrValue<ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>>;
