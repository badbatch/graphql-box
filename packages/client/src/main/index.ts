import Core from "@cachemap/core";
import { CacheManagerDef } from "@graphql-box/cache-manager";
import {
  DEFAULT_TYPE_ID_KEY,
  DebugManagerDef,
  MUTATION,
  MaybeRawResponseData,
  MaybeRequestContext,
  MaybeRequestResult,
  MaybeResponseData,
  QUERY,
  RawResponseDataWithMaybeCacheMetadata,
  RequestContext,
  RequestData,
  RequestDataWithMaybeAST,
  RequestManagerDef,
  RequestOptions,
  SUBSCRIPTION,
  SubscriptionsManagerDef,
  ValidOperations,
} from "@graphql-box/core";
import { hashRequest } from "@graphql-box/helpers";
import { RequestParserDef } from "@graphql-box/request-parser";
import { isAsyncIterable } from "iterall";
import { castArray, isArray, isPlainObject, isString } from "lodash";
import { v1 as uuid } from "uuid";
import logRequest from "../debug/log-request";
import logSubscription from "../debug/log-subscription";
import { ConstructorOptions, PendingQueryData, PendingQueryResolver, QueryTracker, UserOptions } from "../defs";

export default class Client {
  public static async init(options: UserOptions): Promise<Client> {
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

    if (errors.length) return Promise.reject(errors);

    try {
      const typeIDKey = options.typeIDKey || DEFAULT_TYPE_ID_KEY;

      const constructorOptions: ConstructorOptions = {
        cacheManager: await options.cacheManager({ typeIDKey }),
        requestManager: await options.requestManager(),
        requestParser: await options.requestParser({ typeIDKey }),
      };

      if (options.debugManager) {
        constructorOptions.debugManager = await options.debugManager();
      }

      if (options.subscriptionsManager) {
        constructorOptions.subscriptionsManager = await options.subscriptionsManager();
      }

      return new Client(constructorOptions);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private static _areFragmentsInvalid(fragments?: string[]): boolean {
    return !!fragments && (!isArray(fragments) || !fragments.every(value => isString(value)));
  }

  private static _resolve(
    { cacheMetadata, ...rest }: MaybeResponseData,
    options: RequestOptions,
    { boxID }: RequestContext,
  ): MaybeRequestResult {
    const result: MaybeRequestResult = { ...rest, requestID: boxID };

    if (options.returnCacheMetadata && cacheMetadata) {
      result._cacheMetadata = cacheMetadata;
    }

    return result;
  }

  private static _validateRequestArguments(query: string, options: RequestOptions): Error[] {
    const errors: Error[] = [];

    if (!isString(query)) {
      errors.push(new TypeError("@graphql-box/client expected query to be a string."));
    }

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@graphql-box/client expected options to be a plain object."));
    }

    if (Client._areFragmentsInvalid(options.fragments)) {
      errors.push(new TypeError("@graphql-box/client expected options.fragments to be an array of strings."));
    }

    return errors;
  }

  private _cacheManager: CacheManagerDef;
  private _debugManager: DebugManagerDef | null;
  private _queryTracker: QueryTracker = { active: [], pending: new Map() };
  private _requestManager: RequestManagerDef;
  private _requestParser: RequestParserDef;
  private _subscriptionsManager: SubscriptionsManagerDef | null;

  constructor(options: ConstructorOptions) {
    const { cacheManager, debugManager, requestManager, requestParser, subscriptionsManager } = options;
    this._cacheManager = cacheManager;
    this._debugManager = debugManager || null;
    this._requestManager = requestManager;
    this._requestParser = requestParser;
    this._subscriptionsManager = subscriptionsManager || null;
  }

  get cache(): Core {
    return this._cacheManager.cache;
  }

  get debugger(): DebugManagerDef | null {
    return this._debugManager;
  }

  public async request(request: string, options: RequestOptions = {}, context: MaybeRequestContext = {}) {
    const requestContext = this._buildRequestContext(QUERY, request, context);
    const errors = Client._validateRequestArguments(request, options);

    if (errors.length) {
      return Client._resolve({ errors }, options, requestContext);
    }

    return this._request(request, options, requestContext);
  }

  public async subscribe(request: string, options: RequestOptions = {}, context: MaybeRequestContext = {}) {
    const requestContext = this._buildRequestContext(SUBSCRIPTION, request, context);
    const errors: Error[] = [];

    if (!this._subscriptionsManager) {
      errors.push(new Error("@graphql-box/client does not have the subscriptions manager module."));
    }

    errors.push(...Client._validateRequestArguments(request, options));

    if (errors.length) {
      return Client._resolve({ errors }, options, requestContext);
    }

    return this._request(request, options, requestContext);
  }

  private _buildRequestContext(
    operation: ValidOperations,
    request: string,
    context: MaybeRequestContext,
  ): RequestContext {
    return {
      boxID: uuid(),
      debugManager: this._debugManager,
      fieldTypeMap: new Map(),
      operation,
      operationName: "",
      queryFiltered: false,
      request,
      ...context,
    };
  }

  private async _handleMutation(
    requestData: RequestDataWithMaybeAST,
    options: RequestOptions,
    context: RequestContext,
  ) {
    try {
      const resolver = async (rawResponseData: MaybeRawResponseData) => {
        if (rawResponseData.errors) {
          return Client._resolve(rawResponseData, options, context);
        }

        const responseData = await this._cacheManager.cacheResponse(
          requestData as RequestData,
          rawResponseData as RawResponseDataWithMaybeCacheMetadata,
          options,
          context,
        );

        return Client._resolve(responseData, options, context);
      };

      const executeResult = await this._requestManager.execute(requestData, options, context, resolver);

      if (isAsyncIterable(executeResult)) {
        return executeResult;
      }

      return await resolver(executeResult);
    } catch (error) {
      return Client._resolve({ errors: [error] }, options, context);
    }
  }

  private async _handleQuery(requestData: RequestDataWithMaybeAST, options: RequestOptions, context: RequestContext) {
    try {
      const checkResult = await this._cacheManager.checkQueryResponseCacheEntry(requestData.hash, options, context);

      if (checkResult) {
        return Client._resolve(checkResult, options, context);
      }

      const pendingQuery = this._trackQuery(requestData, options, context);

      if (pendingQuery) {
        return pendingQuery;
      }

      let updatedRequestData: RequestDataWithMaybeAST = requestData;
      const analyzeQueryResult = await this._cacheManager.analyzeQuery(requestData as RequestData, options, context);
      const { response, updated } = analyzeQueryResult;

      if (response) {
        return this._resolveQuery(requestData, response, options, context);
      } else if (updated) {
        updatedRequestData = updated;
      }

      const resolver = async (rawResponseData: MaybeRawResponseData) => {
        if (rawResponseData.errors) {
          const { errors, hasNext, paths } = rawResponseData;
          return this._resolveQuery(updatedRequestData, { errors, hasNext, paths }, options, context);
        }

        const responseData = await this._cacheManager.cacheQuery(
          requestData as RequestData,
          updatedRequestData as RequestData,
          rawResponseData as RawResponseDataWithMaybeCacheMetadata,
          options,
          context,
        );

        return this._resolveQuery(requestData, responseData, options, context);
      };

      const executeResult = await this._requestManager.execute(updatedRequestData, options, context, resolver);

      if (isAsyncIterable(executeResult)) {
        return executeResult;
      }

      return await resolver(executeResult);
    } catch (error) {
      return this._resolveQuery(requestData, { errors: castArray(error) }, options, context);
    }
  }

  private _handleRequest(requestData: RequestDataWithMaybeAST, options: RequestOptions, context: RequestContext) {
    if (context.operation === QUERY) {
      return this._handleQuery(requestData, options, context);
    } else if (context.operation === MUTATION) {
      return this._handleMutation(requestData, options, context);
    } else if (context.operation === SUBSCRIPTION) {
      return this._handleSubscription(requestData, options, context);
    }

    const message = "@graphql-box/client expected the operation to be 'query', 'mutation' or 'subscription.";
    return Client._resolve({ errors: [new Error(message)] }, options, context);
  }

  private async _handleSubscription(
    requestData: RequestDataWithMaybeAST,
    options: RequestOptions,
    context: RequestContext,
  ) {
    try {
      const resolver = async (responseData: MaybeRawResponseData) =>
        this._resolveSubscription(requestData, responseData, options, context);

      const subscriptionsManager = this._subscriptionsManager as SubscriptionsManagerDef;
      return await subscriptionsManager.subscribe(requestData, options, context, resolver);
    } catch (error) {
      return Client._resolve({ errors: [error] }, options, context);
    }
  }

  @logRequest()
  private async _request(request: string, options: RequestOptions, context: RequestContext) {
    try {
      const { ast, request: updateRequest } = await this._requestParser.updateRequest(request, options, context);
      const requestData = { ast, hash: hashRequest(updateRequest), request: updateRequest };
      return this._handleRequest(requestData, options, context);
    } catch (error) {
      return Client._resolve({ errors: castArray(error) }, options, context);
    }
  }

  private _resolvePendingRequests({ hash }: RequestDataWithMaybeAST, responseData: MaybeResponseData): void {
    const pendingRequests = this._queryTracker.pending.get(hash);
    if (!pendingRequests) return;

    pendingRequests.forEach(({ context, options, resolve }) => {
      resolve(Client._resolve(responseData, options, context));
    });

    this._queryTracker.pending.delete(hash);
  }

  private async _resolveQuery(
    requestData: RequestDataWithMaybeAST,
    responseData: MaybeResponseData,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<MaybeRequestResult> {
    this._resolvePendingRequests(requestData, responseData);
    this._queryTracker.active = this._queryTracker.active.filter(value => value !== requestData.hash);
    this._cacheManager.deletePartialQueryResponse(requestData.hash);
    return Client._resolve(responseData, options, context);
  }

  @logSubscription()
  private async _resolveSubscription(
    requestData: RequestDataWithMaybeAST,
    rawResponseData: MaybeRawResponseData,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<MaybeRequestResult> {
    try {
      const { errors } = rawResponseData;

      if (errors) {
        return Client._resolve({ errors }, options, context);
      }

      const responseData = await this._cacheManager.cacheResponse(
        requestData as RequestData,
        rawResponseData as RawResponseDataWithMaybeCacheMetadata,
        options,
        context,
      );

      return Client._resolve(responseData, options, context);
    } catch (error) {
      return Client._resolve({ errors: [error] }, options, context);
    }
  }

  private _setPendingQuery(requestHash: string, data: PendingQueryData): void {
    let pending = this._queryTracker.pending.get(requestHash);
    if (!pending) pending = [];
    pending.push(data);
    this._queryTracker.pending.set(requestHash, pending);
  }

  private _trackQuery(
    { hash }: RequestDataWithMaybeAST,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<MaybeRequestResult> | void {
    if (this._queryTracker.active.includes(hash)) {
      return new Promise((resolve: PendingQueryResolver) => {
        this._setPendingQuery(hash, { context, options, resolve });
      });
    }

    this._queryTracker.active.push(hash);
  }
}
