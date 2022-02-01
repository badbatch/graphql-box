import { Maybe, PlainObjectMap } from "@graphql-box/core";
import { DocumentNode, ExecutionResult, GraphQLFieldResolver, GraphQLSchema } from "graphql";
import { ExecutionArgs } from "graphql/execution/execute";

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

export type InitOptions = UserOptions;

export type ConstructorOptions = UserOptions;

export type GraphQLSubscribe = <TData = PlainObjectMap<unknown>>(args: {
  contextValue?: any;
  document: DocumentNode;
  fieldResolver?: Maybe<GraphQLFieldResolver<any, any>>;
  operationName?: Maybe<string>;
  rootValue?: any;
  schema: GraphQLSchema;
  subscribeFieldResolver?: Maybe<GraphQLFieldResolver<any, any>>;
  variableValues?: Maybe<{ [key: string]: any }>;
}) => Promise<AsyncIterator<ExecutionResult<TData>> | ExecutionResult<TData>>;

export interface SubscribeArgs extends ExecutionArgs {
  subscribeFieldResolver?: Maybe<GraphQLFieldResolver<any, any>>;
}
