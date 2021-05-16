import {
  MaybeRawResponseData,
  PlainObjectMap,
  RequestContext,
  RequestDataWithMaybeAST,
  RequestManagerDef,
  RequestManagerInit,
  ServerRequestOptions,
} from "@graphql-box/core";
import { ExecutionArgs, GraphQLFieldResolver, GraphQLSchema, execute, parse } from "graphql";
import { isPlainObject } from "lodash";
import logExecute from "../debug/log-execute";
import { ConstructorOptions, GraphQLExecute, InitOptions, UserOptions } from "../defs";

export class Execute implements RequestManagerDef {
  public static async init(options: InitOptions): Promise<Execute> {
    const errors: TypeError[] = [];

    if (!(options.schema instanceof GraphQLSchema)) {
      errors.push(new TypeError("@graphql-box/execute expected options.schema to be a GraphQL schema."));
    }

    if (errors.length) return Promise.reject(errors);

    return new Execute(options);
  }

  private _contextValue: PlainObjectMap;
  private _execute: GraphQLExecute;
  private _fieldResolver?: GraphQLFieldResolver<any, any> | null;
  private _rootValue: any;
  private _schema: GraphQLSchema;

  constructor(options: ConstructorOptions) {
    this._contextValue = options.contextValue || {};
    this._execute = options.execute || execute;
    this._fieldResolver = options.fieldResolver || null;
    this._rootValue = options.rootValue;
    this._schema = options.schema;
  }

  @logExecute()
  public async execute(
    { ast, request }: RequestDataWithMaybeAST,
    options: ServerRequestOptions,
    { boxID }: RequestContext,
  ): Promise<MaybeRawResponseData> {
    const { contextValue = {}, fieldResolver, operationName, rootValue } = options;

    const executeArgs: ExecutionArgs = {
      contextValue: { ...this._contextValue, ...contextValue, boxID },
      document: ast || parse(request),
      fieldResolver: fieldResolver || this._fieldResolver,
      operationName,
      rootValue: rootValue || this._rootValue,
      schema: this._schema,
    };

    try {
      const { data, errors } = await this._execute(executeArgs);
      return { data, errors };
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default function init(userOptions: UserOptions): RequestManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@graphql-box/execute expected userOptions to be a plain object.");
  }

  return () => Execute.init(userOptions);
}
