import { ExecutionArgs, ExecutionResult, GraphQLFieldResolver, GraphQLSchema } from "graphql";
import { ExecutionResultDataDefault } from "graphql/execution/execute";
import { MaybePromise } from "graphql/jsutils/MaybePromise";

export interface UserOptions {
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

// tslint:disable-next-line:max-line-length
export type GraphQLExecute = <TData = ExecutionResultDataDefault>(args: ExecutionArgs) => MaybePromise<ExecutionResult<TData>>;
