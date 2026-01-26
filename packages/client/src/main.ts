import { type Core } from '@cachemap/core';
import { type CacheManagerDef } from '@graphql-box/cache-manager';
import {
  type DebugManagerDef,
  OPERATION_RESOLVED,
  type OperationContext,
  type OperationData,
  type OperationOptions,
  type OperationParams,
  PENDING_QUERY_RESOLVED,
  type PartialOperationContext,
  type PlainObject,
  QUERY_RESOLVED_FROM_CACHE,
  type RequestManagerDef,
  type ResponseData,
  type ResponseDataWithoutErrors,
} from '@graphql-box/core';
import { ArgsError, GroupedError, hashOperation, isArray, isPlainObject } from '@graphql-box/helpers';
import { type OperationParserDef } from '@graphql-box/operation-parser';
import { OperationTypeNode } from 'graphql';
import { isString } from 'lodash-es';
import { v4 as uuid } from 'uuid';
import { type PendingQueryResolver, type QueryTracker, type UserOptions } from '#types.ts';
import { logOperation } from './debug/logOperation.ts';
import { logPendingQuery } from './debug/logPendingQuery.ts';

export class Client {
  private static _areFragmentsInvalid(fragments?: string[]): boolean {
    return !!fragments && (!isArray(fragments) || !fragments.every(value => isString(value)));
  }

  private static _resolve(
    responseData: ResponseData,
    _options: OperationOptions,
    context: OperationContext,
  ): ResponseData & { operationId: string } {
    return { ...responseData, operationId: context.data.operationId };
  }

  private static _validateOperationArgs(query: string, options: OperationOptions): ArgsError[] {
    const errors: ArgsError[] = [];

    if (!isString(query)) {
      errors.push(new ArgsError('@graphql-box/client expected query to be a string.'));
    }

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@graphql-box/client expected options to be a plain object.'));
    }

    if (Client._areFragmentsInvalid(options.fragments)) {
      errors.push(new ArgsError('@graphql-box/client expected options.fragments to be an array of strings.'));
    }

    return errors;
  }

  private readonly _cacheManager: CacheManagerDef;
  private readonly _debugManager: DebugManagerDef | undefined;
  private readonly _idKey: string;
  private readonly _operationParser: OperationParserDef;
  private readonly _queryTracker: QueryTracker = { active: [], pending: {} };
  private readonly _requestManager: RequestManagerDef;

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@graphql-box/client expected options to be a plain object.'));
    }

    if (!('cacheManager' in options)) {
      errors.push(new ArgsError('@graphql-box/client expected options.cacheManager.'));
    }

    if (!('requestManager' in options)) {
      errors.push(new ArgsError('@graphql-box/client expected options.requestManager.'));
    }

    if (!('operationParser' in options)) {
      errors.push(new ArgsError('@graphql-box/client expected options.operationParser.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/client argument validation errors.', errors);
    }

    this._cacheManager = options.cacheManager;
    this._debugManager = options.debugManager;
    this._idKey = options.idKey ?? 'id';
    this._operationParser = options.operationParser;
    this._requestManager = options.requestManager;
  }

  get cache(): Core | undefined {
    return this._cacheManager.cache;
  }

  get debugManager(): DebugManagerDef | undefined {
    return this._debugManager;
  }

  public query<T extends PlainObject = PlainObject>(
    operation: string,
    options: OperationOptions = {},
    context: PartialOperationContext = {},
  ): Promise<ResponseData<T> & { operationId: string }> {
    const errors = Client._validateOperationArgs(operation, options);

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/client argument validation errors', errors);
    }

    const operationContext = this._buildOperationContext(OperationTypeNode.QUERY, operation, options, context);
    const operationData = this._operationParser.buildOperationData(operation, options, operationContext);

    // Casting to allow user to type response data while allowing downstream code
    // to be more generic.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this._handleQuery(operationData, options, operationContext) as Promise<
      ResponseData<T> & { operationId: string }
    >;
  }

  private _buildOperationContext(
    operationType: OperationTypeNode,
    operation: string,
    options: OperationOptions,
    context: PartialOperationContext,
  ): OperationContext {
    return {
      ...context,
      data: {
        ...context.data,
        batched: options.batch,
        operationId: uuid(),
        operationMaxFieldDepth: undefined,
        operationName: '',
        operationType,
        operationTypeComplexity: undefined,
        rawOperationHash: hashOperation(operation),
        tag: options.tag,
        variables: options.variables,
      },
      debugManager: this._debugManager,
      fieldPaths: {},
      idKey: this._idKey,
    };
  }

  @logOperation()
  private async _handleQuery(
    operationData: OperationData,
    options: OperationOptions,
    context: OperationContext,
  ): Promise<ResponseData> {
    const pendingQuery = await this._trackQuery(operationData, options, context);

    if (pendingQuery) {
      return pendingQuery;
    }

    const analyzeResult = await this._cacheManager.analyzeQuery(operationData, context);

    if (analyzeResult.kind === 'cache-hit') {
      this._debugManager?.log(QUERY_RESOLVED_FROM_CACHE, {
        data: {
          ...context.data,
        },
      });

      return this._resolveQuery(operationData, analyzeResult.responseData, options, context);
    }

    const executeResult = await this._requestManager.execute(analyzeResult.operationData, options, context);
    await this._cacheManager.cacheQuery(analyzeResult.operationData, executeResult, context);
    const finalAnalyzeResult = await this._cacheManager.analyzeQuery(operationData, context);

    if (finalAnalyzeResult.kind !== 'cache-hit') {
      console.error(
        'Final response data not returned from cache manager, there is a problem with how the cache manager has stored/retrieved the response data.',
      );

      return this._resolveQuery(
        operationData,
        { data: undefined, extensions: { cacheMetadata: {} } },
        options,
        context,
      );
    }

    this._debugManager?.log(OPERATION_RESOLVED, {
      data: context.data,
      stats: { endTime: this._debugManager.now() },
    });

    return this._resolveQuery(operationData, finalAnalyzeResult.responseData, options, context);
  }

  private _resolvePendingQueries(operationData: OperationData, responseData: ResponseData): void {
    const pendingQueries = this._queryTracker.pending[operationData.hash];

    if (!pendingQueries) {
      return;
    }

    for (const { context, options, resolver } of pendingQueries) {
      this._debugManager?.log(PENDING_QUERY_RESOLVED, {
        data: context.data,
      });

      resolver(Client._resolve(responseData, options, context));
    }

    // This is not a problem in this scenario.
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this._queryTracker.pending[operationData.hash];
  }

  private _resolveQuery(
    operationData: OperationData,
    responseData: ResponseData,
    options: OperationOptions,
    context: OperationContext,
  ): ResponseData {
    this._resolvePendingQueries(operationData, responseData);

    this._queryTracker.active = this._queryTracker.active.filter(
      activeQuery => activeQuery.operationData.hash !== operationData.hash,
    );

    return Client._resolve(responseData, options, context);
  }

  @logPendingQuery()
  private _setPendingQuery(activeQuery: OperationParams, resolver: PendingQueryResolver): void {
    const { hash: operationHash } = activeQuery.operationData;
    const pending = this._queryTracker.pending[operationHash] ?? [];
    pending.push({ ...activeQuery, resolver });
    this._queryTracker.pending[operationHash] = pending;
  }

  private _trackQuery(
    operationData: OperationData,
    options: OperationOptions,
    context: OperationContext,
  ): Promise<ResponseDataWithoutErrors> | undefined {
    const matchingActiveQuery = this._queryTracker.active.find(
      activeQuery => activeQuery.operationData.hash === operationData.hash,
    );

    if (matchingActiveQuery) {
      return new Promise((resolver: PendingQueryResolver) => {
        this._setPendingQuery(matchingActiveQuery, resolver);
      });
    }

    this._queryTracker.active.push({ context, operationData, options });
    return;
  }
}
