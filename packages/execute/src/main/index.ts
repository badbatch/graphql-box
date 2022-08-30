import {
  DehydratedCacheMetadata,
  EXECUTE_RESOLVED,
  MaybeRawResponseData,
  MaybeRequestResult,
  PlainObjectMap,
  RequestContext,
  RequestData,
  RequestManagerDef,
  RequestManagerInit,
  RequestResolver,
  ServerRequestOptions,
} from "@graphql-box/core";
import { EventAsyncIterator, getFragmentDefinitions, setCacheMetadata, standardizePath } from "@graphql-box/helpers";
import EventEmitter from "eventemitter3";
import { ExecutionArgs, GraphQLFieldResolver, GraphQLSchema, execute } from "graphql";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { isPlainObject } from "lodash";
import logExecute from "../debug/log-execute";
import { ConstructorOptions, GraphQLExecute, UserOptions } from "../defs";

export class Execute implements RequestManagerDef {
  private _contextValue: PlainObjectMap;
  private _eventEmitter: EventEmitter;
  private _execute: GraphQLExecute;
  private _fieldResolver?: GraphQLFieldResolver<any, any> | null;
  private _rootValue: any;
  private _schema: GraphQLSchema;

  constructor(options: ConstructorOptions) {
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
    executeResolver: RequestResolver,
  ) {
    const { contextValue = {}, fieldResolver, operationName, rootValue } = options;
    const _cacheMetadata: DehydratedCacheMetadata = {};
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

      if (!isAsyncIterable(executeResult)) {
        return { ...executeResult, _cacheMetadata };
      }

      forAwaitEach(executeResult, async result => {
        context.normalizePatchResponseData = !!("path" in result);

        const enrichedResult = ({
          _cacheMetadata,
          ...standardizePath(result),
        } as unknown) as MaybeRawResponseData;

        debugManager?.log(EXECUTE_RESOLVED, {
          context: { requestID, ...otherContext },
          options,
          requestHash: hash,
          result: enrichedResult,
          stats: { endTime: debugManager?.now() },
        });

        this._eventEmitter.emit(hash, await executeResolver(enrichedResult));
      });

      const eventAsyncIterator = new EventAsyncIterator<MaybeRequestResult>(this._eventEmitter, hash);
      return eventAsyncIterator.getIterator();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default function init(userOptions: UserOptions): RequestManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@graphql-box/execute expected userOptions to be a plain object.");
  }

  return () => new Execute(userOptions);
}
