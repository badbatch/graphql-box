import { PlainObjectMap } from "@graphql-box/core";
import { ExecutionArgs, ExecutionResult, GraphQLFieldResolver, GraphQLSchema } from "graphql";
import { ExecutionResultDataDefault } from "graphql/execution/execute";
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

export type InitOptions = UserOptions;

export type ConstructorOptions = UserOptions;

export type GraphQLExecute = <TData = ExecutionResultDataDefault>(
  args: ExecutionArgs,
) => PromiseOrValue<ExecutionResult<TData>>;
