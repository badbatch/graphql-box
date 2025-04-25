import { type CacheManagerDef } from '@graphql-box/cache-manager';
import {
  type DebugManagerDef,
  PENDING_QUERY_RESOLVED,
  type PartialRawResponseData,
  type PartialRequestContext,
  type PartialRequestResult,
  type PartialResponseData,
  REQUEST_RESOLVED,
  REQUEST_RESOLVED_FROM_CACHE,
  type RawResponseDataWithMaybeCacheMetadata,
  type RequestContext,
  type RequestData,
  type RequestManagerDef,
  type RequestOptions,
  SUBSCRIPTION_RESOLVED,
  type SubscriptionsManagerDef,
} from '@graphql-box/core';
import { ArgsError, GroupedError, hashRequest, isArray, isPlainObject } from '@graphql-box/helpers';
import { type RequestParserDef } from '@graphql-box/request-parser';
import { OperationTypeNode } from 'graphql';
import { isAsyncIterable } from 'iterall';
import { isError, isString } from 'lodash-es';
import { v4 as uuid } from 'uuid';
import { logPendingQuery } from './debug/logPendingQuery.ts';
import { logRequest } from './debug/logRequest.ts';
import { logSubscription } from './debug/logSubscription.ts';
import { filterResponseData } from './helpers/filterResponseData.ts';
import { isDataRequestedInActiveQuery } from './helpers/isDataRequestedInActiveQuery.ts';
import { isQueryActive } from './helpers/isQueryActive.ts';
import { type PendingQueryData, type PendingQueryResolver, type QueryTracker, type UserOptions } from './types.ts';

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

  private static _validateRequestArguments(query: string, options: RequestOptions): ArgsError[] {
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
  private readonly _experimentalDeferStreamSupport: boolean;
  private _queryTracker: QueryTracker = { active: [], pending: new Map() };
  private _requestManager: RequestManagerDef;
  private _requestParser: RequestParserDef;
  private readonly _subscriptionsManager: SubscriptionsManagerDef | null;

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

    if (!('requestParser' in options)) {
      errors.push(new ArgsError('@graphql-box/client expected options.requestParser.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/client argument validation errors.', errors);
    }

    this._cacheManager = options.cacheManager;
    this._debugManager = options.debugManager;
    this._experimentalDeferStreamSupport = options.experimentalDeferStreamSupport ?? false;
    this._requestManager = options.requestManager;
    this._requestParser = options.requestParser;
    this._subscriptionsManager = options.subscriptionsManager ?? null;
  }

  get cache() {
    return this._cacheManager.cache;
  }

  get cacheManager() {
    return this._cacheManager;
  }

  get debugger(): DebugManagerDef | undefined {
    return this._debugManager;
  }

  public async mutate(request: string, options: RequestOptions = {}, context: PartialRequestContext = {}) {
    const requestContext = this._buildRequestContext(OperationTypeNode.MUTATION, request, options, context);
    const errors = Client._validateRequestArguments(request, options);

    if (errors.length > 0) {
      return Client._resolve({ errors }, options, requestContext);
    }

    return this._request(request, options, requestContext);
  }

  public async query(request: string, options: RequestOptions = {}, context: PartialRequestContext = {}) {
    const requestContext = this._buildRequestContext(OperationTypeNode.QUERY, request, options, context);
    const errors = Client._validateRequestArguments(request, options);

    if (errors.length > 0) {
      return Client._resolve({ errors }, options, requestContext);
    }

    return this._request(request, options, requestContext);
  }

  public async request(request: string, options: RequestOptions = {}, context: PartialRequestContext = {}) {
    const requestContext = this._buildRequestContext(OperationTypeNode.QUERY, request, options, context);
    const errors = Client._validateRequestArguments(request, options);

    if (errors.length > 0) {
      return Client._resolve({ errors }, options, requestContext);
    }

    return this._request(request, options, requestContext);
  }

  public async subscribe(request: string, options: RequestOptions = {}, context: PartialRequestContext = {}) {
    const requestContext = this._buildRequestContext(OperationTypeNode.SUBSCRIPTION, request, options, context);
    const errors: Error[] = [];

    if (!this._subscriptionsManager) {
      errors.push(new Error('@graphql-box/client does not have the subscriptions manager module.'));
    }

    errors.push(...Client._validateRequestArguments(request, options));

    if (errors.length > 0) {
      return Client._resolve({ errors }, options, requestContext);
    }

    return this._request(request, options, requestContext);
  }

  private _buildRequestContext(
    operation: OperationTypeNode,
    request: string,
    options: RequestOptions,
    context: PartialRequestContext,
  ): RequestContext {
    return {
      ...context,
      data: {
        ...context.data,
        batched: options.batch,
        operation,
        operationName: '',
        originalRequestHash: hashRequest(request),
        queryFiltered: false,
        requestComplexity: undefined,
        requestDepth: undefined,
        requestID: uuid(),
        tag: options.tag,
        variables: options.variables,
      },
      debugManager: this._debugManager,
      deprecated: {
        experimentalDeferStreamSupport: this._experimentalDeferStreamSupport,
      },
      fieldTypeMap: new Map(),
      filteredRequest: '',
      parsedRequest: '',
      request,
    };
  }

  @logRequest()
  private async _handleMutation(requestData: RequestData, options: RequestOptions, context: RequestContext) {
    try {
      const resolver = async (rawResponseData: PartialRawResponseData) => {
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

      const executeResult = await this._requestManager.execute(requestData, options, context, decoratedResolver);

      if (isAsyncIterable(executeResult)) {
        return executeResult;
      }

      return await resolver(executeResult);
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/client mutation had an unexpected error.');

      return Client._resolve({ errors: [confirmedError] }, options, context);
    }
  }

  @logRequest()
  private async _handleQuery(requestData: RequestData, options: RequestOptions, context: RequestContext) {
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

  private _handleRequest(requestData: RequestData, options: RequestOptions, context: RequestContext) {
    switch (context.data.operation) {
      case OperationTypeNode.QUERY: {
        return this._handleQuery(requestData, options, context);
      }

      case OperationTypeNode.MUTATION: {
        return this._handleMutation(requestData, options, context);
      }

      case OperationTypeNode.SUBSCRIPTION: {
        return this._handleSubscription(requestData, options, context);
      }

      // No default
    }
  }

  @logSubscription()
  private async _handleSubscription(requestData: RequestData, options: RequestOptions, context: RequestContext) {
    try {
      const resolver = async (responseData: PartialRawResponseData) => {
        const result = await this._resolveSubscription(requestData, responseData, options, context);
        const { data, debugManager } = context;

        debugManager?.log(SUBSCRIPTION_RESOLVED, {
          data,
          stats: { endTime: debugManager.now() },
        });

        return result;
      };

      // In order to get into _handleSubscription, the subscriptionsManager
      // must be defined.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return await this._subscriptionsManager!.subscribe(requestData, options, context, resolver);
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/client subscription had an unexpected error.');

      return Client._resolve({ errors: [confirmedError] }, options, context);
    }
  }

  private _isDataRequestedInActiveQuery(requestData: RequestData, context: RequestContext) {
    if (isQueryActive(this._queryTracker.active, requestData)) {
      return requestData.hash;
    }

    return !!this._cacheManager.cacheTiersEnabled.entity || !!this._cacheManager.cacheTiersEnabled.requestPath
      ? isDataRequestedInActiveQuery(this._queryTracker.active, requestData, context)
      : undefined;
  }

  private async _request(request: string, options: RequestOptions, context: RequestContext) {
    try {
      const { ast, request: updateRequest } = this._requestParser.updateRequest(request, options, context);
      const requestData = { ast, hash: hashRequest(updateRequest), request: updateRequest };
      context.data.parsedRequestHash = requestData.hash;
      return await this._handleRequest(requestData, options, { ...context, parsedRequest: updateRequest });
    } catch (error) {
      const confirmedError = isError(error) ? error : new Error('@graphql-box/client had an unexpected error.');
      return Client._resolve({ errors: [confirmedError] }, options, context);
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
