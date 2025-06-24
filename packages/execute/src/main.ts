import {
  type DehydratedCacheMetadata,
  EXECUTE_RESOLVED,
  type PartialRawResponseData,
  type PartialRequestResult,
  type PlainObject,
  type RequestContext,
  type RequestData,
  type RequestResolver,
  type ServerRequestOptions,
} from '@graphql-box/core';
import {
  ArgsError,
  EventAsyncIterator,
  GroupedError,
  getFragmentDefinitions,
  setCacheMetadata,
  standardizePath,
} from '@graphql-box/helpers';
import { EventEmitter } from 'eventemitter3';
import { type ExecutionArgs, type GraphQLFieldResolver, GraphQLSchema, execute } from 'graphql';
import { forAwaitEach, isAsyncIterable } from 'iterall';
import { omit } from 'lodash-es';
import { logExecute } from './debug/logExecute.ts';
import { type GraphQLExecute, type UserOptions } from './types.ts';

export class Execute {
  private readonly _contextValue: PlainObject & { data?: PlainObject };
  private readonly _eventEmitter: EventEmitter;
  private readonly _execute: GraphQLExecute;
  private readonly _fieldResolver?: GraphQLFieldResolver<unknown, unknown> | null;
  private readonly _rootValue: unknown;
  private readonly _schema: GraphQLSchema;

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    if (!(options.schema instanceof GraphQLSchema)) {
      errors.push(new ArgsError('@graphql-box/execute expected options.schema to be a GraphQL schema.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/execute argument validation errors.', errors);
    }

    this._contextValue = options.contextValue ?? {};
    this._eventEmitter = new EventEmitter();
    this._execute = options.execute ?? execute;
    this._fieldResolver = options.fieldResolver ?? null;
    this._rootValue = options.rootValue;
    this._schema = options.schema;
  }

  @logExecute()
  public async execute(
    { ast, hash }: RequestData,
    options: ServerRequestOptions,
    context: RequestContext,
    executeResolver: RequestResolver,
  ): Promise<AsyncIterableIterator<PartialRequestResult | undefined> | PartialRawResponseData> {
    const { contextValue = {}, fieldResolver, operationName, rootValue } = options;
    const _cacheMetadata: DehydratedCacheMetadata = {};
    const { data, debugManager } = context;

    const executeArgs: ExecutionArgs = {
      contextValue: {
        ...this._contextValue,
        ...contextValue,
        data: {
          ...omit(data, ['variables', 'tag', 'requestDepth', 'requestComplexity', 'queryFiltered']),
          ...this._contextValue.data,
          ...contextValue.data,
        },
        debugManager,
        fragmentDefinitions: getFragmentDefinitions(ast),
        setCacheMetadata: setCacheMetadata(_cacheMetadata),
      },
      document: ast,
      fieldResolver: fieldResolver ?? this._fieldResolver,
      // TODO: Need to understand why operationName is being passed in options
      // as the one on the context is derived from the request itself.
      operationName,
      rootValue: rootValue ?? this._rootValue,
      schema: this._schema,
    };

    const executeResult = await this._execute(executeArgs);

    if (!isAsyncIterable(executeResult)) {
      return { ...executeResult, _cacheMetadata };
    }

    void forAwaitEach(executeResult, async result => {
      context.deprecated.normalizePatchResponseData = 'path' in result;

      // Typescript not inferring enrichedResult is same type
      // as PartialRawResponseData.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const enrichedResult = {
        _cacheMetadata,
        ...standardizePath(result),
      } as PartialRawResponseData;

      debugManager?.log(EXECUTE_RESOLVED, {
        data,
        stats: { endTime: debugManager.now() },
      });

      this._eventEmitter.emit(hash, await executeResolver(enrichedResult));
    });

    const eventAsyncIterator = new EventAsyncIterator<PartialRequestResult>(this._eventEmitter, hash);
    return eventAsyncIterator.getIterator();
  }
}
