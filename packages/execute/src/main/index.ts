import {
  CacheMetadata,
  EXECUTE_RESOLVED,
  IncrementalRequestManagerResult,
  PlainObjectMap,
  RequestContext,
  RequestData,
  RequestManagerExecuteResolver,
  RequestManagerResult,
  ServerRequestOptions,
} from "@graphql-box/core";
import {
  EventAsyncIterator,
  areIncrementalExecutionResults,
  getFragmentDefinitions,
  setCacheMetadata,
} from "@graphql-box/helpers";
import EventEmitter from "eventemitter3";
import { ExecutionArgs, GraphQLFieldResolver, GraphQLSchema, execute } from "graphql";
import { forAwaitEach } from "iterall";
import logExecute from "../debug/log-execute";
import { GraphQLExecute, UserOptions } from "../defs";

export default class Execute {
  private _contextValue: PlainObjectMap;
  private _eventEmitter: EventEmitter;
  private _execute: GraphQLExecute;
  private _fieldResolver?: GraphQLFieldResolver<any, any> | null;
  private _rootValue: any;
  private _schema: GraphQLSchema;

  constructor(options: UserOptions) {
    const errors: TypeError[] = [];

    if (!(options.schema instanceof GraphQLSchema)) {
      errors.push(new TypeError("@graphql-box/execute expected options.schema to be a GraphQL schema."));
    }

    if (errors.length) {
      throw errors;
    }

    this._contextValue = options.contextValue || {};
    this._eventEmitter = new EventEmitter();
    this._execute = options.execute || (execute as GraphQLExecute);
    this._fieldResolver = options.fieldResolver || null;
    this._rootValue = options.rootValue;
    this._schema = options.schema;
  }

  @logExecute()
  public async execute(
    { ast, hash }: RequestData,
    options: ServerRequestOptions,
    context: RequestContext,
    executeResolver: RequestManagerExecuteResolver,
  ): Promise<RequestManagerResult | AsyncIterableIterator<IncrementalRequestManagerResult | undefined>> {
    const { contextValue = {}, fieldResolver, operationName, rootValue } = options;
    const _cacheMetadata: CacheMetadata = new Map();
    const { debugManager, requestID, ...otherContext } = context;

    const executeArgs: ExecutionArgs = {
      contextValue: {
        ...this._contextValue,
        ...contextValue,
        debugManager,
        fragmentDefinitions: getFragmentDefinitions(ast),
        requestID,
        setCacheMetadata: setCacheMetadata(_cacheMetadata),
      },
      document: ast,
      fieldResolver: fieldResolver || this._fieldResolver,
      operationName,
      rootValue: rootValue || this._rootValue,
      schema: this._schema,
    };

    try {
      const executeResult = await this._execute(executeArgs);

      if (!areIncrementalExecutionResults(executeResult)) {
        return { ...executeResult, _cacheMetadata };
      }

      forAwaitEach(executeResult.subsequentResults, async result => {
        debugManager?.log(EXECUTE_RESOLVED, {
          context: { requestID, ...otherContext },
          options,
          requestHash: hash,
          result: { ...result, _cacheMetadata },
          stats: { endTime: debugManager?.now() },
        });

        this._eventEmitter.emit(hash, await executeResolver({ ...result, _cacheMetadata }));
      });

      return await new Promise(
        async (resolve: (value: AsyncIterableIterator<IncrementalRequestManagerResult | undefined>) => void) => {
          const eventAsyncIterator = new EventAsyncIterator<IncrementalRequestManagerResult>(this._eventEmitter, hash);
          resolve(eventAsyncIterator.getIterator());
          this._eventEmitter.emit(hash, await executeResolver({ ...executeResult.initialResult, _cacheMetadata }));
        },
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
