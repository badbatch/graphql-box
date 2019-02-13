import { cacheDefs } from "@handl/cache-manager";
import { coreDefs, hashRequest } from "@handl/core";
import { debugDefs } from "@handl/debug-manager";
import { requestDefs } from "@handl/request-manager";
import { parserDefs } from "@handl/request-parser";
import { subDefs } from "@handl/subscriptions-manager";
import { DocumentNode } from "graphql";
import { isAsyncIterable } from "iterall";
import { isArray, isPlainObject, isString } from "lodash";
import uuid from "uuid/v1";
import { DEFAULT_TYPE_ID_KEY, MUTATION, QUERY, SUBSCRIPTION } from "../consts";
import logFetch from "../debug/log-fetch";
import logRequest from "../debug/log-request";
import logSubscription from "../debug/log-subscription";
import * as defs from "../defs";

export default class Client {
  public static async init(options: defs.UserOptions): Promise<Client> {
    const errors: TypeError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@handl/client expected options to ba a plain object."));
    }

    if (this._areModulesInvalid(options)) {
      errors.push(new TypeError("@handl/client expected both options.cacheManager and options.requestParser."));
    }

    if (errors.length) return Promise.reject(errors);

    try {
      Client._debugManager = options.debugManager;

      const typeIDKey = options.typeIDKey || DEFAULT_TYPE_ID_KEY;

      const constructorOptions: defs.ConstructorOptions = {
        requestManager: await options.requestManager(),
      };

      if (options.cacheManager) {
        constructorOptions.cacheManager = await options.cacheManager({ typeIDKey });
      }

      if (options.requestParser) {
        constructorOptions.requestParser = await options.requestParser({ typeIDKey });
      }

      if (options.subscriptionsManager) {
        constructorOptions.subscriptionsManager = await options.subscriptionsManager();
      }

      return new Client(constructorOptions);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private static _debugManager: debugDefs.DebugManager | undefined;

  private static _areFragmentsInvalid(fragments?: string[]): boolean {
    return !!fragments && (!isArray(fragments) || !fragments.every((value) => isString(value)));
  }

  private static _areModulesInvalid(options: defs.UserOptions): boolean {
    return (!!options.cacheManager && !options.requestParser) || (!options.cacheManager && !!options.requestParser);
  }

  private static _getRequestContext(operation: coreDefs.ValidOperations, request: string): coreDefs.RequestContext {
    return {
      fieldTypeMap: new Map(),
      handlID: uuid(),
      operation,
      operationName: "",
      queryFiltered: false,
      request,
    };
  }

  private static _resolve(
    { cacheMetadata, data, errors }: coreDefs.MaybeResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): coreDefs.MaybeRequestResult {
    const result: coreDefs.MaybeRequestResult = { data, errors };
    if (options.returnCacheMetadata && cacheMetadata) result._cacheMetadata = cacheMetadata;
    return result;
  }

  private static _validateRequestArguments(query: string, options: coreDefs.RequestOptions): Error[] {
    const errors: Error[] = [];

    if (!isString(query)) {
      errors.push(new TypeError("@handl/client expected query to be a string."));
    }

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@handl/client expected options to be a plain object."));
    }

    if (Client._areFragmentsInvalid(options.fragments)) {
      errors.push(new TypeError("@handl/client expected options.fragments to be an array of strings."));
    }

    return errors;
  }

  private _cacheManager: cacheDefs.CacheManager | undefined;
  private _queryTracker: defs.QueryTracker = { active: [], pending: new Map() };
  private _requestManager: requestDefs.RequestManager;
  private _requestParser: parserDefs.RequestParser | undefined;
  private _subscriptionsManager: subDefs.SubscriptionsManager | undefined;

  constructor(options: defs.ConstructorOptions) {
    const { cacheManager, requestManager, requestParser, subscriptionsManager } = options;
    this._cacheManager = cacheManager;
    this._requestManager = requestManager;
    this._requestParser = requestParser;
    this._subscriptionsManager = subscriptionsManager;
  }

  public async request(request: string, options: coreDefs.RequestOptions = {}): Promise<coreDefs.MaybeRequestResult> {
    const errors = Client._validateRequestArguments(request, options);
    if (errors.length) return { errors };

    try {
      return this._request(request, options, Client._getRequestContext(QUERY, request)) as coreDefs.MaybeRequestResult;
    } catch (error) {
      return { errors: error };
    }
  }

  public async subscribe(
    request: string,
    options: coreDefs.RequestOptions = {},
  ): Promise<AsyncIterable<any> | coreDefs.MaybeRequestResult> {
    const errors: Error[] = [];

    if (!this._subscriptionsManager) {
      errors.push(new Error("@handl/client does not have the subscriptions manager module."));
    }

    errors.push(...Client._validateRequestArguments(request, options));
    if (errors.length) return { errors };

    try {
      return this._request(request, options, Client._getRequestContext(SUBSCRIPTION, request));
    } catch (error) {
      return { errors: error };
    }
  }

  @logFetch(Client._debugManager)
  private async _fetch(
    requestData: coreDefs.RequestDataWithMaybeAST,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.MaybeRawResponseData> {
    try {
      return this._requestManager.fetch(requestData);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _handleMutation(
    requestData: coreDefs.RequestDataWithMaybeAST,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.MaybeRequestResult> {
    try {
      const rawResponseData = await this._fetch(requestData, options, context);

      const { data, errors } = rawResponseData;
      if (errors) return Promise.reject(errors);

      let responseData = { data };

      if (this._cacheManager) {
        responseData = await this._cacheManager.resolveRequest(
          requestData as coreDefs.RequestData,
          rawResponseData as coreDefs.RawResponseDataWithMaybeCacheMetadata,
          options,
          context,
        );
      }

      return Client._resolve(responseData, options, context);
    } catch (errors) {
      return Promise.reject(errors);
    }
  }

  private async _handleQuery(
    requestData: coreDefs.RequestDataWithMaybeAST,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.MaybeRequestResult> {
    try {
      if (this._cacheManager) {
        const checkResult = await this._cacheManager.checkQueryResponseCacheEntry(requestData.hash, options, context);

        if (checkResult) return Client._resolve(checkResult, options, context);
      }

      const pendingQuery = this._trackQuery(requestData, options, context);
      if (pendingQuery) return pendingQuery as Promise<coreDefs.MaybeRequestResult>;

      let updatedRequestData: coreDefs.RequestDataWithMaybeAST = requestData;

      if (this._cacheManager) {
        const analyzeQueryResult = await this._cacheManager.analyzeQuery(
          requestData as coreDefs.RequestData,
          options,
          context,
        );

        const { response, updated } = analyzeQueryResult;

        if (response) {
          return this._resolveQuery(requestData, response, options, context);
        } else if (updated) {
          updatedRequestData = updated;
        }
      }

      const rawResponseData = await this._fetch(updatedRequestData, options, context);

      const { data, errors } = rawResponseData;
      if (errors) return this._resolveQuery(updatedRequestData, { errors }, options, context);

      let responseData = { data };

      if (this._cacheManager) {
        responseData = await this._cacheManager.resolveQuery(
          requestData as coreDefs.RequestData,
          updatedRequestData as coreDefs.RequestData,
          rawResponseData as coreDefs.RawResponseDataWithMaybeCacheMetadata,
          options,
          context,
        );
      }

      return this._resolveQuery(requestData, responseData, options, context);
    } catch (errors) {
      return this._resolveQuery(requestData, { errors }, options, context);
    }
  }

  private _handleRequest(
    requestData: coreDefs.RequestDataWithMaybeAST,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<AsyncIterable<any> | coreDefs.MaybeRequestResult> {
    try {
      if (context.operation === QUERY) {
        return this._handleQuery(requestData, options, context);
      } else if (context.operation === MUTATION) {
        return this._handleMutation(requestData, options, context);
      } else if (context.operation === SUBSCRIPTION) {
        return this._handleSubscription(requestData, options, context);
      }

      const message = "@handl/client expected the operation to be 'query', 'mutation' or 'subscription.";
      return Promise.reject(new Error(message));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _handleSubscription(
    requestData: coreDefs.RequestDataWithMaybeAST,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<AsyncIterable<any> | coreDefs.MaybeRequestResult> {
    try {
      const resolver = async (responseData: coreDefs.MaybeRawResponseData) =>
        this._resolveSubscription(requestData, responseData, options, context);

      const subscriptionsManager = this._subscriptionsManager as subDefs.SubscriptionsManager;
      const subscribeResult = await subscriptionsManager.subscribe(requestData, options, resolver);

      if (isAsyncIterable(subscribeResult)) return subscribeResult as AsyncIterable<any>;

      return this._resolveSubscription(requestData, subscribeResult as coreDefs.MaybeRawResponseData, options, context);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @logRequest(Client._debugManager)
  private async _request(
    request: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<AsyncIterable<any> | coreDefs.MaybeRequestResult> {
    try {
      let updatedRequest = request;
      let ast: DocumentNode | undefined;

      if (this._requestParser) {
        const updated = await this._requestParser.updateRequest(request, options, context);

        updatedRequest = updated.request;
        ast = updated.ast;
      }

      const requestData = { ast, hash: hashRequest(updatedRequest), request: updatedRequest };
      return this._handleRequest(requestData, options, context);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _resolvePendingRequests(
    { hash }: coreDefs.RequestDataWithMaybeAST,
    responseData: coreDefs.MaybeResponseData,
  ): void {
    const pendingRequests = this._queryTracker.pending.get(hash);
    if (!pendingRequests) return;

    pendingRequests.forEach(({ context, options, resolve }) => {
      resolve(Client._resolve(responseData, options, context));
    });

    this._queryTracker.pending.delete(hash);
  }

  private async _resolveQuery(
    requestData: coreDefs.RequestDataWithMaybeAST,
    responseData: coreDefs.MaybeResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.MaybeRequestResult> {
    this._resolvePendingRequests(requestData, responseData);
    this._queryTracker.active = this._queryTracker.active.filter((value) => value !== requestData.hash);
    if (this._cacheManager) this._cacheManager.deletePartialQueryResponse(requestData.hash);
    return Client._resolve(responseData, options, context);
  }

  @logSubscription(Client._debugManager)
  private async _resolveSubscription(
    requestData: coreDefs.RequestDataWithMaybeAST,
    rawResponseData: coreDefs.MaybeRawResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.MaybeRequestResult> {
    try {
      const { data, errors } = rawResponseData;
      if (errors) return Client._resolve({ errors }, options, context);

      let responseData = { data };

      if (this._cacheManager) {
        responseData = await this._cacheManager.resolveRequest(
          requestData as coreDefs.RequestData,
          rawResponseData as coreDefs.RawResponseDataWithMaybeCacheMetadata,
          options,
          context,
        );
      }

      return Client._resolve(responseData, options, context);
    } catch (errors) {
      return Client._resolve({ errors }, options, context);
    }
  }

  private _setPendingQuery(requestHash: string, data: defs.PendingQueryData): void {
    let pending = this._queryTracker.pending.get(requestHash);
    if (!pending) pending = [];
    pending.push(data);
    this._queryTracker.pending.set(requestHash, pending);
  }

  private async _trackQuery(
    { hash }: coreDefs.RequestDataWithMaybeAST,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.MaybeRequestResult | void> {
    if (this._queryTracker.active.includes(hash)) {
      return new Promise((resolve: defs.PendingQueryResolver) => {
        this._setPendingQuery(hash, { context, options, resolve });
      });
    }

    this._queryTracker.active.push(hash);
  }
}
