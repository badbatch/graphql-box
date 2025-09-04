import { type CacheManagerDef } from '@graphql-box/cache-manager';
import {
  type DebugManagerDef,
  type OperationContext,
  type OperationData,
  type OperationOptions,
  PENDING_QUERY_RESOLVED,
  type PartialOperationContext,
  type PlainObject,
  REQUEST_RESOLVED,
  REQUEST_RESOLVED_FROM_CACHE,
  type RequestManagerDef,
  type ResponseData,
} from '@graphql-box/core';
import { ArgsError, GroupedError, hashRequest, isArray, isPlainObject } from '@graphql-box/helpers';
import { type OperationParserDef } from '@graphql-box/operation-parser';
import { OperationTypeNode } from 'graphql';
import { isAsyncIterable } from 'iterall';
import { isError, isString } from 'lodash-es';
import { v4 as uuid } from 'uuid';
import { logPendingQuery } from './debug/logPendingQuery.ts';
import { logRequest } from './debug/logRequest.ts';
import { filterResponseData } from './helpers/filterResponseData.ts';
import { type QueryTracker, type UserOptions } from './types.ts';

export class Client {
  private static _areFragmentsInvalid(fragments?: string[]): boolean {
    return !!fragments && (!isArray(fragments) || !fragments.every(value => isString(value)));
  }

  private static _resolve(
    { cacheMetadata, ...rest }: PartialResponseData,
    options: RequestOptions,
    { data }: RequestContext,
  ): PartialRequestResult {
    const result: PartialRequestResult = { ...rest, requestID: data.requestID };

    if (options.returnCacheMetadata && cacheMetadata) {
      result._cacheMetadata = cacheMetadata;
    }

    return result;
  }

  private static _validateOperationArguments(query: string, options: OperationOptions): ArgsError[] {
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
  private readonly _operationParser: OperationParserDef;
  private readonly _requestManager: RequestManagerDef;
  private readonly _tracker: QueryTracker = { activeQueries: [] };

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@graphql-box/client expected options to ba a plain object.'));
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
    this._requestManager = options.requestManager;
    this._operationParser = options.operationParser;
  }

  get cacheManager() {
    return this._cacheManager;
  }

  get debugManager(): DebugManagerDef | undefined {
    return this._debugManager;
  }

  public async query<T extends PlainObject = PlainObject>(
    operation: string,
    options: OperationOptions = {},
    context: PartialOperationContext = {},
  ): Promise<ResponseData<T>> {
    const errors = Client._validateOperationArguments(operation, options);

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/client argument validation errors', errors);
    }

    const operationContext = this._buildOperationContext(OperationTypeNode.QUERY, operation, options, context);
    const operationData = this._operationParser.update(operation, options, operationContext);
    return this._handleQuery<T>(operationData, options, operationContext);
  }

  private _buildOperationContext(
    operationType: OperationTypeNode,
    request: string,
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
        originalOperationHash: hashRequest(request),
        tag: options.tag,
        variables: options.variables,
      },
      debugManager: this._debugManager,
      fieldPaths: undefined,
    };
  }

  @logRequest()
  private async _handleQuery<T extends PlainObject = PlainObject>(
    requestData: OperationData,
    options: OperationOptions,
    context: OperationContext,
  ): Promise<ResponseData<T>> {
    try {
      const checkResult = await this._cacheManager.checkQueryResponseCacheEntry(requestData.hash, options, context);

      if (checkResult) {
        this._debugManager?.log(REQUEST_RESOLVED_FROM_CACHE, {
          data: {
            ...context.data,
            requestHash: requestData.hash,
          },
        });

        return Client._resolve(checkResult, options, context);
      }

      const pendingQuery = this._trackQuery(requestData, options, context);

      if (pendingQuery) {
        // Need to look at this in more detail
        // eslint-disable-next-line @typescript-eslint/return-await
        return pendingQuery;
      }

      let updatedRequestData: RequestData | undefined;
      const analyzeQueryResult = await this._cacheManager.analyzeQuery(requestData, options, context);
      const { response, updated } = analyzeQueryResult;

      if (response) {
        return this._resolveQuery(requestData, response, options, context);
      } else if (updated) {
        updatedRequestData = updated;
      }

      const resolver = async (rawResponseData: PartialRawResponseData) => {
        if (rawResponseData.errors?.length) {
          const { errors, hasNext, paths } = rawResponseData;
          return this._resolveQuery(updatedRequestData ?? requestData, { errors, hasNext, paths }, options, context);
        }

        const responseData = await this._cacheManager.cacheQuery(
          requestData,
          updatedRequestData,
          // Need to look at what type guards can be put in place
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          rawResponseData as RawResponseDataWithMaybeCacheMetadata,
          options,
          context,
        );

        return this._resolveQuery(requestData, responseData, options, context);
      };

      const { data, debugManager } = context;

      const decoratedResolver = async (rawResponseData: PartialRawResponseData) => {
        const result = await resolver(rawResponseData);

        debugManager?.log(REQUEST_RESOLVED, {
          data,
          stats: { endTime: debugManager.now() },
        });

        return result;
      };

      const executeResult = await this._requestManager.execute(
        updatedRequestData ?? requestData,
        options,
        context,
        decoratedResolver,
      );

      if (isAsyncIterable(executeResult)) {
        return executeResult;
      }

      return await resolver(executeResult);
    } catch (error) {
      const confirmedError = isError(error) ? error : new Error('@graphql-box/client query had an unexpected error.');
      return this._resolveQuery(requestData, { errors: [confirmedError] }, options, context);
    }
  }

  private async _resolvePendingRequests(
    activeRquestData: RequestData,
    activeResponseData: PartialResponseData,
    activeContext: RequestContext,
  ): Promise<void> {
    const pendingRequests = this._queryTracker.pending.get(activeRquestData.hash);

    if (!pendingRequests) {
      return;
    }

    for (const { context, options, requestData, resolve } of pendingRequests) {
      const { data, debugManager } = context;

      if (activeRquestData.hash === requestData.hash || activeResponseData.errors?.length) {
        debugManager?.log(PENDING_QUERY_RESOLVED, {
          data,
        });

        resolve(Client._resolve(activeResponseData, options, context));
      } else if (activeResponseData.data && activeResponseData.cacheMetadata) {
        const filteredResponseData = filterResponseData(
          requestData,
          activeRquestData,
          {
            ...requestData,
            cacheMetadata: activeResponseData.cacheMetadata,
            data: activeResponseData.data,
          },
          { active: activeContext, pending: context },
        );

        debugManager?.log(PENDING_QUERY_RESOLVED, {
          data,
        });

        await this._cacheManager.setQueryResponseCacheEntry(requestData, filteredResponseData, options, context);
        resolve(Client._resolve(filteredResponseData, options, context));
      }
    }

    this._queryTracker.pending.delete(activeRquestData.hash);
  }

  private _resolveQuery(
    requestData: RequestData,
    responseData: PartialResponseData,
    options: RequestOptions,
    context: RequestContext,
  ): PartialRequestResult {
    void this._resolvePendingRequests(requestData, responseData, context);

    this._queryTracker.active = this._queryTracker.active.filter(
      ({ requestData: activeRequestData }) => activeRequestData.hash !== requestData.hash,
    );

    this._cacheManager.deletePartialQueryResponse(requestData.hash);
    return Client._resolve(responseData, options, context);
  }

  private async _resolveSubscription(
    requestData: RequestData,
    rawResponseData: PartialRawResponseData,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<PartialRequestResult> {
    try {
      if (rawResponseData.errors?.length) {
        const { errors, hasNext, paths } = rawResponseData;
        return Client._resolve({ errors, hasNext, paths }, options, context);
      }

      const responseData = await this._cacheManager.cacheResponse(
        requestData,
        // Need to look at what type guards can be put in place
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        rawResponseData as RawResponseDataWithMaybeCacheMetadata,
        options,
        context,
      );

      return Client._resolve(responseData, options, context);
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/client subscription had an unexpected error.');

      return Client._resolve({ errors: [confirmedError] }, options, context);
    }
  }

  @logPendingQuery()
  private _setPendingQuery(requestHash: string, data: PendingQueryData): void {
    const pending = this._queryTracker.pending.get(requestHash) ?? [];
    pending.push(data);
    this._queryTracker.pending.set(requestHash, pending);
  }

  private _trackQuery(
    requestData: RequestData,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<PartialRequestResult> | undefined {
    const matchingRequestHash = this._isDataRequestedInActiveQuery(requestData, context);

    if (matchingRequestHash) {
      return new Promise((resolve: PendingQueryResolver) => {
        this._setPendingQuery(matchingRequestHash, { context, options, requestData, resolve });
      });
    }

    this._queryTracker.active.push({ context, options, requestData });
    return;
  }
}
