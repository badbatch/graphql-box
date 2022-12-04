import Core from "@cachemap/core";
import { CacheManagerDef } from "@graphql-box/cache-manager";
import {
  CacheManagerResult,
  CacheResult,
  DebugManagerDef,
  IncrementalCacheManagerResult,
  IncrementalRequestManagerResult,
  IncrementalRequestResult,
  MUTATION,
  MaybeRequestContext,
  PENDING_QUERY_RESOLVED,
  QUERY,
  REQUEST_RESOLVED,
  RequestContext,
  RequestData,
  RequestManagerDef,
  RequestManagerResult,
  RequestOptions,
  RequestResult,
  SUBSCRIPTION,
  SUBSCRIPTION_RESOLVED,
  SubscriptionsManagerDef,
  SubscriptionsManagerResult,
  ValidOperations,
} from "@graphql-box/core";
import { hashRequest } from "@graphql-box/helpers";
import { RequestParserDef } from "@graphql-box/request-parser";
import { GraphQLError } from "graphql";
import { isAsyncIterable } from "iterall";
import { castArray, isArray, isPlainObject, isString } from "lodash";
import { v1 as uuid } from "uuid";
import logPendingQuery from "../debug/log-pending-query";
import logRequest from "../debug/log-request";
import logSubscription from "../debug/log-subscription";
import { PendingQueryData, PendingQueryResolver, QueryTracker, UserOptions } from "../defs";
import filterResponseData from "../helpers/filterResponseData";
import isDataRequestedInActiveQuery from "../helpers/isDataRequestedInActiveQuery";
import isQueryActive from "../helpers/isQueryActive";

export default class Client {
  private static _areFragmentsInvalid(fragments?: string[]): boolean {
    return !!fragments && (!isArray(fragments) || !fragments.every(value => isString(value)));
  }

  private static _resolve(
    result:
      | CacheResult
      | CacheManagerResult
      | IncrementalCacheManagerResult
      | Omit<RequestManagerResult, "headers">
      | Omit<IncrementalRequestManagerResult, "headers">
      | SubscriptionsManagerResult
      | { errors: GraphQLError[] },
    options: RequestOptions,
    { requestID }: RequestContext,
  ): RequestResult | IncrementalRequestResult {
    if ("_cacheMetadata" in result) {
      const { _cacheMetadata, ...rest } = result;

      return {
        ...rest,
        ...(options.returnCacheMetadata ? { _cacheMetadata } : {}),
        requestID,
      };
    }

    return { ...result, requestID };
  }

  private static _validateRequestArguments(query: string, options: RequestOptions): GraphQLError[] {
    const errors: GraphQLError[] = [];

    if (!isString(query)) {
      errors.push(new GraphQLError("@graphql-box/client expected query to be a string."));
    }

    if (!isPlainObject(options)) {
      errors.push(new GraphQLError("@graphql-box/client expected options to be a plain object."));
    }

    if (Client._areFragmentsInvalid(options.fragments)) {
      errors.push(new GraphQLError("@graphql-box/client expected options.fragments to be an array of strings."));
    }

    return errors;
  }

  private _cacheManager: CacheManagerDef;
  private _debugManager: DebugManagerDef | null;
  private _experimentalDeferStreamSupport: boolean;
  private _queryTracker: QueryTracker = { active: [], pending: new Map() };
  private _requestManager: RequestManagerDef;
  private _requestParser: RequestParserDef;
  private _subscriptionsManager: SubscriptionsManagerDef | null;

  constructor(options: UserOptions) {
    const errors: TypeError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@graphql-box/client expected options to ba a plain object."));
    }

    if (!options.cacheManager) {
      errors.push(new TypeError("@graphql-box/client expected options.cacheManager."));
    }

    if (!options.requestParser) {
      errors.push(new TypeError("@graphql-box/client expected options.requestParser."));
    }

    if (!options.requestManager) {
      errors.push(new TypeError("@graphql-box/client expected options.requestManager."));
    }

    if (errors.length) {
      throw errors;
    }

    this._cacheManager = options.cacheManager;
    this._debugManager = options.debugManager ?? null;
    this._experimentalDeferStreamSupport = options.experimentalDeferStreamSupport ?? false;
    this._requestManager = options.requestManager;
    this._requestParser = options.requestParser;
    this._subscriptionsManager = options.subscriptionsManager ?? null;
  }

  get cache(): Core {
    return this._cacheManager.cache;
  }

  get debugger(): DebugManagerDef | null {
    return this._debugManager;
  }

  public async mutate(
    request: string,
    options: RequestOptions = {},
    context: MaybeRequestContext = {},
  ): Promise<RequestResult | AsyncIterableIterator<IncrementalRequestResult | undefined>> {
    const requestContext = this._buildRequestContext(MUTATION, request, context);
    const errors = Client._validateRequestArguments(request, options);

    if (errors.length) {
      return Client._resolve({ errors }, options, requestContext);
    }

    return this._request(request, options, requestContext);
  }

  public async query(
    request: string,
    options: RequestOptions = {},
    context: MaybeRequestContext = {},
  ): Promise<RequestResult | AsyncIterableIterator<IncrementalRequestResult | undefined>> {
    const requestContext = this._buildRequestContext(QUERY, request, context);
    const errors = Client._validateRequestArguments(request, options);

    if (errors.length) {
      return Client._resolve({ errors }, options, requestContext);
    }

    return this._request(request, options, requestContext);
  }

  public async request(
    request: string,
    options: RequestOptions = {},
    context: MaybeRequestContext = {},
  ): Promise<RequestResult | AsyncIterableIterator<IncrementalRequestResult | undefined>> {
    const requestContext = this._buildRequestContext(QUERY, request, context);
    const errors = Client._validateRequestArguments(request, options);

    if (errors.length) {
      return Client._resolve({ errors }, options, requestContext);
    }

    return this._request(request, options, requestContext);
  }

  public async subscribe(
    request: string,
    options: RequestOptions = {},
    context: MaybeRequestContext = {},
  ): Promise<RequestResult | AsyncIterableIterator<RequestResult | undefined>> {
    const requestContext = this._buildRequestContext(SUBSCRIPTION, request, context);
    const errors: GraphQLError[] = [];

    if (!this._subscriptionsManager) {
      errors.push(new GraphQLError("@graphql-box/client does not have the subscriptions manager module."));
    }

    errors.push(...Client._validateRequestArguments(request, options));

    if (errors.length) {
      return Client._resolve({ errors }, options, requestContext);
    }

    return this._subscribe(request, options, requestContext);
  }

  private _buildRequestContext(
    operation: ValidOperations,
    request: string,
    context: MaybeRequestContext,
  ): RequestContext {
    return {
      debugManager: this._debugManager,
      experimentalDeferStreamSupport: this._experimentalDeferStreamSupport,
      fieldTypeMap: new Map(),
      filteredRequest: "",
      operation,
      operationName: "",
      parsedRequest: "",
      queryFiltered: false,
      request,
      requestComplexity: null,
      requestDepth: null,
      requestID: uuid(),
      whitelistHash: hashRequest(request),
      ...context,
    };
  }

  @logRequest()
  private async _handleMutation(
    requestData: RequestData,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<RequestResult | AsyncIterableIterator<IncrementalRequestResult | undefined>> {
    try {
      const resolver = async (result: RequestManagerResult | IncrementalRequestManagerResult) => {
        if ("errors" in result && result.errors?.length) {
          const { headers, ...rest } = result;
          return Client._resolve(rest, options, context);
        }

        const cachedResult = await this._cacheManager.cacheResponse(requestData, result, options, context);
        return Client._resolve(cachedResult, options, context);
      };

      const { debugManager, ...otherContext } = context;

      const decoratedResolver = async (result: IncrementalRequestManagerResult): Promise<IncrementalRequestResult> => {
        const resolvedResult = (await resolver(result)) as IncrementalRequestResult;

        debugManager?.log(REQUEST_RESOLVED, {
          context: otherContext,
          options,
          requestHash: requestData.hash,
          result: resolvedResult,
          stats: { endTime: debugManager?.now() },
        });

        return resolvedResult;
      };

      const executeResult = await this._requestManager.execute(requestData, options, context, decoratedResolver);

      if (isAsyncIterable(executeResult)) {
        return executeResult;
      }

      return await resolver(executeResult);
    } catch (error) {
      return Client._resolve({ errors: [error] }, options, context);
    }
  }

  @logRequest()
  private async _handleQuery(
    requestData: RequestData,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<RequestResult | AsyncIterableIterator<IncrementalRequestResult | undefined>> {
    try {
      const checkResult = await this._cacheManager.checkQueryResponseCacheEntry(requestData.hash, options, context);

      if (checkResult) {
        return Client._resolve(checkResult, options, context);
      }

      const pendingQuery = this._trackQuery(requestData, options, context);

      if (pendingQuery) {
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

      const resolver = async (result: RequestManagerResult | IncrementalRequestManagerResult) => {
        if ("errors" in result && result.errors?.length) {
          return this._resolveQuery(updatedRequestData ?? requestData, result, options, context);
        }

        const cachedResult = await this._cacheManager.cacheQuery(
          requestData,
          updatedRequestData,
          result,
          options,
          context,
        );

        return this._resolveQuery(requestData, cachedResult, options, context);
      };

      const { debugManager, ...otherContext } = context;

      const decoratedResolver = async (result: IncrementalRequestManagerResult): Promise<IncrementalRequestResult> => {
        const resolvedResult = (await resolver(result)) as IncrementalRequestResult;

        debugManager?.log(REQUEST_RESOLVED, {
          context: otherContext,
          options,
          requestHash: requestData.hash,
          result: resolvedResult,
          stats: { endTime: debugManager?.now() },
        });

        return resolvedResult;
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
      return this._resolveQuery(requestData, { errors: castArray(error) }, options, context);
    }
  }

  private async _handleRequest(
    requestData: RequestData,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<RequestResult | AsyncIterableIterator<IncrementalRequestResult | undefined>> {
    if (context.operation === QUERY) {
      return this._handleQuery(requestData, options, context);
    } else if (context.operation === MUTATION) {
      return this._handleMutation(requestData, options, context);
    }

    const message = "@graphql-box/client expected the operation to be 'query' or 'mutation'";
    return Client._resolve({ errors: [new GraphQLError(message)] }, options, context);
  }

  @logSubscription()
  private async _handleSubscription(
    requestData: RequestData,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<RequestResult | AsyncIterableIterator<RequestResult | undefined>> {
    try {
      const resolver = async (result: SubscriptionsManagerResult) => {
        const resolvedResult = await this._resolveSubscription(requestData, result, options, context);
        const { debugManager, ...otherContext } = context;

        debugManager?.log(SUBSCRIPTION_RESOLVED, {
          context: otherContext,
          options,
          requestHash: requestData.hash,
          result: resolvedResult,
          stats: { endTime: debugManager?.now() },
        });

        return resolvedResult;
      };

      const subscriptionsManager = this._subscriptionsManager as SubscriptionsManagerDef;
      return await subscriptionsManager.subscribe(requestData, options, context, resolver);
    } catch (error) {
      return Client._resolve({ errors: [error] }, options, context);
    }
  }

  private _isDataRequestedInActiveQuery(requestData: RequestData, context: RequestContext) {
    if (isQueryActive(this._queryTracker.active, requestData)) {
      return requestData.hash;
    }

    return isDataRequestedInActiveQuery(this._queryTracker.active, requestData, context);
  }

  private async _request(
    request: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<RequestResult | AsyncIterableIterator<IncrementalRequestResult | undefined>> {
    try {
      const { ast, request: updateRequest } = await this._requestParser.updateRequest(request, options, context);
      const requestData = { ast, hash: hashRequest(updateRequest), request: updateRequest };
      return this._handleRequest(requestData, options, { ...context, parsedRequest: updateRequest });
    } catch (error) {
      return Client._resolve({ errors: castArray(error) }, options, context);
    }
  }

  private _resolvePendingRequests(
    activeRquestData: RequestData,
    activeResult:
      | CacheResult
      | CacheManagerResult
      | IncrementalCacheManagerResult
      | RequestManagerResult
      | IncrementalRequestManagerResult
      | { errors: GraphQLError[] },
    activeContext: RequestContext,
  ): void {
    const pendingRequests = this._queryTracker.pending.get(activeRquestData.hash);

    if (!pendingRequests) {
      return;
    }

    pendingRequests.forEach(async ({ context, options, requestData, resolve }) => {
      const { debugManager, ...otherContext } = context;

      if (activeRquestData.hash === requestData.hash || ("errors" in activeResult && activeResult.errors?.length)) {
        debugManager?.log(PENDING_QUERY_RESOLVED, {
          activeRequestHash: activeRquestData.hash,
          context: otherContext,
          options,
          pendingRequestHash: requestData.hash,
          result: activeResult,
        });

        resolve(Client._resolve(activeResult, options, context));
      } else if ("data" in activeResult && activeResult.data && "_cacheMetadata" in activeResult) {
        const filteredResult = filterResponseData(requestData, activeRquestData, activeResult, {
          active: activeContext,
          pending: context,
        });

        debugManager?.log(PENDING_QUERY_RESOLVED, {
          activeRequestHash: activeRquestData.hash,
          context: otherContext,
          options,
          pendingRequestHash: requestData.hash,
          result: filteredResult,
        });

        await this._cacheManager.setQueryResponseCacheEntry(requestData, filteredResult, options, context);
        resolve(Client._resolve(filteredResult, options, context));
      }
    });

    this._queryTracker.pending.delete(activeRquestData.hash);
  }

  private async _resolveQuery(
    requestData: RequestData,
    result:
      | CacheResult
      | CacheManagerResult
      | IncrementalCacheManagerResult
      | RequestManagerResult
      | IncrementalRequestManagerResult
      | { errors: GraphQLError[] },
    options: RequestOptions,
    context: RequestContext,
  ): Promise<RequestResult | IncrementalRequestResult> {
    this._resolvePendingRequests(requestData, result, context);

    this._queryTracker.active = this._queryTracker.active.filter(
      ({ requestData: activeRequestData }) => activeRequestData.hash !== requestData.hash,
    );

    this._cacheManager.deletePartialQueryResponse(requestData.hash);
    return Client._resolve(result, options, context);
  }

  private async _resolveSubscription(
    requestData: RequestData,
    result: SubscriptionsManagerResult,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<RequestResult> {
    try {
      if ("errors" in result && result.errors?.length) {
        return Client._resolve(result, options, context);
      }

      const responseData = await this._cacheManager.cacheResponse(requestData, result, options, context);
      return Client._resolve(responseData, options, context);
    } catch (error) {
      return Client._resolve({ errors: [error] }, options, context);
    }
  }

  @logPendingQuery()
  private _setPendingQuery(requestHash: string, data: PendingQueryData): void {
    let pending = this._queryTracker.pending.get(requestHash);

    if (!pending) {
      pending = [];
    }

    pending.push(data);
    this._queryTracker.pending.set(requestHash, pending);
  }

  private async _subscribe(
    request: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<RequestResult | AsyncIterableIterator<RequestResult | undefined>> {
    if (context.operation !== SUBSCRIPTION) {
      const message = "@graphql-box/client expected the operation to be 'subscription'";
      return Client._resolve({ errors: [new GraphQLError(message)] }, options, context);
    }

    try {
      const { ast, request: updateRequest } = await this._requestParser.updateRequest(request, options, context);
      const requestData = { ast, hash: hashRequest(updateRequest), request: updateRequest };
      return this._handleSubscription(requestData, options, { ...context, parsedRequest: updateRequest });
    } catch (error) {
      return Client._resolve({ errors: castArray(error) }, options, context);
    }
  }

  private _trackQuery(
    requestData: RequestData,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<RequestResult> | void {
    const matchingRequestHash = this._isDataRequestedInActiveQuery(requestData, context);

    if (matchingRequestHash) {
      return new Promise((resolve: PendingQueryResolver) => {
        this._setPendingQuery(matchingRequestHash, { context, options, requestData, resolve });
      });
    }

    this._queryTracker.active.push({ requestData, options, context });
  }
}
