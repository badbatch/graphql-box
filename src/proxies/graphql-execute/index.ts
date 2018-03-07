import {
  DocumentNode,
  execute,
  ExecutionArgs,
  GraphQLFieldResolver,
  GraphQLSchema,
} from "graphql";

import { isFunction, isString } from "lodash";
import { GraphQLExecuteProxyArgs } from "./types";
import { RequestExecutorResolveResult, RequestOptions } from "../../types";

export default class GraphQLExecuteProxy {
  private _fieldResolver?: GraphQLFieldResolver<any, any>;
  private _rootValue: any;
  private _schema: GraphQLSchema;

  constructor({ fieldResolver, rootValue, schema }: GraphQLExecuteProxyArgs) {
    if (isFunction(fieldResolver)) this._fieldResolver = fieldResolver;
    this._rootValue = rootValue;
    this._schema = schema;
  }

  public async resolve(
    /**
     * The GraphQL request string is not used
     * in this method, but is declared as an argument
     * so that the method has the same signature as
     * the FetchManager resolve method.
     *
     */
    request: string,
    ast: DocumentNode,
    opts: RequestOptions,
  ): Promise<RequestExecutorResolveResult> {
    const executeArgs: ExecutionArgs = {
      contextValue: opts.contextValue,
      document: ast,
      rootValue: this._rootValue,
      schema: this._schema,
    };

    const fieldResolver = (isFunction(opts.fieldResolver) && opts.fieldResolver) || this._fieldResolver;
    if (fieldResolver) executeArgs.fieldResolver = fieldResolver;
    if (isString(opts.operationName)) executeArgs.operationName = opts.operationName;

    try {
      const { data, errors } = await execute(executeArgs);
      return { data, errors };
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
