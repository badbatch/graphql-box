import { cacheDefs } from "@handl/cache-manager";
import { coreDefs, hashRequest } from "@handl/core";
import { debugDefs } from "@handl/debug-manager";
import { requestDefs } from "@handl/request-manager";
import { parserDefs } from "@handl/request-parser";
import { subDefs } from "@handl/subscriptions-manager";
import { isAsyncIterable } from "iterall";
import { isArray, isPlainObject, isString } from "lodash";
import uuid from "uuid/v1";
import { DEFAULT_TYPE_ID_KEY, MUTATION, QUERY, QUERY_RESPONSES, SUBSCRIPTION } from "../consts";
import logFetch from "../debug/log-fetch";
import logRequest from "../debug/log-request";
import logSubscription from "../debug/log-subscription";
import {
  ConstructorOptions,
  InitOptions,
  PendingQueryData,
  PendingQueryResolver,
  QueryTracker,
} from "../defs";

export default class Client {
  public static async init(options: InitOptions): Promise<Client> {
    const errors: TypeError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@handl/client expected options to ba a plain object."));
    }

    if (this._areModulesInvalid(options)) {
      errors.push(new TypeError("@handl/client expected both options.cacheManager and options.requestParser."));
    }

    if (errors.length) return Promise.reject(errors);

    try {
      if (options.debugManager) {
        Client._debugManager = await options.debugManager();
      }

      const typeIDKey = options.typeIDKey || DEFAULT_TYPE_ID_KEY;

      const constructorOptions: ConstructorOptions = {
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

      const instance = new Client(constructorOptions);
      return instance;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private static _debugManager: debugDefs.DebugManager | undefined;

  private static _areFragmentsInvalid(fragments?: string[]): boolean {
    return !!fragments && (!isArray(fragments) || !fragments.every((value) => isString(value)));
  }

  private static _areModulesInvalid(options: InitOptions): boolean {
    return (!!options.cacheManager && !options.requestParser) || (!options.cacheManager && !!options.requestParser);
  }

  private static _getRequestContext(operation: coreDefs.ValidOperations): coreDefs.RequestContext {
    return {
      fieldTypeMap: new Map(),
      filtered: false,
      handlID: uuid(),
      operation,
      operationName: "",
    };
  }

  private static _resolve(
    { cacheMetadata, data, errors }: coreDefs.ResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): coreDefs.RequestResult {
    const result: coreDefs.RequestResult = { data, errors };
    if (options.cacheMetadata) result._cacheMetadata = cacheMetadata;
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
  private _queryTracker: QueryTracker = { active: [], pending: new Map() };
  private _requestManager: requestDefs.RequestManager;
  private _requestParser: parserDefs.RequestParser | undefined;
  private _subscriptionsManager: subDefs.SubscriptionsManager | undefined;

  constructor(options: ConstructorOptions) {
    const { cacheManager, requestManager, requestParser, subscriptionsManager } = options;
    if (cacheManager) this._cacheManager = cacheManager;
    this._requestManager = requestManager;
    if (requestParser) this._requestParser = requestParser;
    if (subscriptionsManager) this._subscriptionsManager = subscriptionsManager;
  }

  public async request(request: string, options: coreDefs.RequestOptions = {}): Promise<coreDefs.RequestResult> {
    const errors = Client._validateRequestArguments(request, options);
    if (errors.length) return { errors };

    try {
      return this._request(request, options, Client._getRequestContext(QUERY)) as coreDefs.RequestResult;
    } catch (error) {
      return { errors: error };
    }
  }

  public async subscribe(
    request: string,
    options: coreDefs.RequestOptions = {},
  ): Promise<AsyncIterable<any> | coreDefs.RequestResult> {
    const errors: Error[] = [];

    if (!this._subscriptionsManager) {
      errors.push(new Error("@handl/client does not have the subscriptions manager module."));
    }

    errors.push(...Client._validateRequestArguments(request, options));
    if (errors.length) return { errors };

    try {
      return this._request(request, options, Client._getRequestContext(SUBSCRIPTION));
    } catch (error) {
      return { errors: error };
    }
  }

  @logFetch(Client._debugManager)
  private async _fetch(
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.RawResponseData> {
    try {
      return this._requestManager.fetch(requestData);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _handleMutation(
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.RequestResult> {
    try {
      const rawResponseData = await this._fetch(requestData, options, context);
      let { cacheMetadata, headers, ...responseData } = rawResponseData; // tslint:disable-line

      if (this._cacheManager) {
        responseData = await this._cacheManager.resolve(
          requestData,
          rawResponseData,
          options,
          context,
        );
      }

      return Client._resolve(responseData, options, context);
    } catch (error) {
      return Client._resolve({ errors: error }, options, context);
    }
  }

  private async _handleQuery(
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.RequestResult> {
    try {
      if (this._cacheManager) {
        const checkResult = await this._cacheManager.check(QUERY_RESPONSES, requestData);
        if (checkResult) return Client._resolve(checkResult, options, context);
      }

      const pendingQuery = this._trackQuery(requestData, options, context);
      if (pendingQuery) return pendingQuery as Promise<coreDefs.RequestResult>;

      let updatedRequestData: coreDefs.RequestData = requestData;

      if (this._cacheManager) {
        const analyzeQueryResult = await this._cacheManager.analyzeQuery(requestData, options, context);
        const { response, updated } = analyzeQueryResult;

        if (response) {
          return this._resolveQuery(requestData, response, options, context);
        } else if (updated) {
          updatedRequestData = updated;
        }
      }

      const rawResponseData = await this._fetch(updatedRequestData, options, context);
      let { cacheMetadata, headers, ...responseData } = rawResponseData; // tslint:disable-line

      if (this._cacheManager) {
        responseData = await this._cacheManager.resolveQuery(
          requestData,
          updatedRequestData,
          rawResponseData,
          options,
          context,
        );
      }

      return this._resolveQuery(requestData, responseData, options, context);
    } catch (error) {
      return this._resolveQuery(requestData, { errors: error }, options, context);
    }
  }

  private _handleRequest(
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<AsyncIterable<any> | coreDefs.RequestResult> {
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
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<AsyncIterable<any> | coreDefs.RequestResult> {
    try {
      const resolver = async (responseData: coreDefs.RawResponseData) =>
        this._resolveSubscription(requestData, responseData, options, context);

      const subscriptionsManager = this._subscriptionsManager as subDefs.SubscriptionsManager;
      const subscribeResult = await subscriptionsManager.subscribe(requestData, options, resolver);
      if (isAsyncIterable(subscribeResult)) return subscribeResult as AsyncIterable<any>;

      return this._resolveSubscription(requestData, subscribeResult as coreDefs.RawResponseData, options, context);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @logRequest(Client._debugManager)
  private async _request(
    request: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<AsyncIterable<any> | coreDefs.RequestResult> {
    try {
      let updatedRequest = request;
      let ast;

      if (this._requestParser) {
        const updated = await this._requestParser.updateRequest(request, options, context);
        if (updated.errors.length) return Promise.reject(updated.errors);

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
    { hash }: coreDefs.RequestData,
    responseData: coreDefs.ResponseData,
  ): void {
    const pendingRequests = this._queryTracker.pending.get(hash);
    if (!pendingRequests) return;

    pendingRequests.forEach(({ context, options, resolve }) => {
      resolve(Client._resolve(responseData, options, context));
    });

    this._queryTracker.pending.delete(hash);
  }

  private async _resolveQuery(
    requestData: coreDefs.RequestData,
    responseData: coreDefs.ResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.RequestResult> {
    this._resolvePendingRequests(requestData, responseData);
    this._queryTracker.active = this._queryTracker.active.filter((value) => value !== requestData.hash);
    return Client._resolve(responseData, options, context);
  }

  @logSubscription(Client._debugManager)
  private async _resolveSubscription(
    requestData: coreDefs.RequestData,
    rawResponseData: coreDefs.RawResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.RequestResult> {
    try {
      let { cacheMetadata, ...responseData } = rawResponseData; // tslint:disable-line

      if (this._cacheManager) {
        responseData = await this._cacheManager.resolve(
          requestData,
          rawResponseData,
          options,
          context,
        );
      }

      return Client._resolve(responseData, options, context);
    } catch (error) {
      return Client._resolve({ errors: error }, options, context);
    }
  }

  private _setPendingQuery(requestHash: string, data: PendingQueryData): void {
    let pending = this._queryTracker.pending.get(requestHash);
    if (!pending) pending = [];
    pending.push(data);
    this._queryTracker.pending.set(requestHash, pending);
  }

  private async _trackQuery(
    { hash }: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.RequestResult | void> {
    if (this._queryTracker.active.includes(hash)) {
      return new Promise((resolve: PendingQueryResolver) => {
        this._setPendingQuery(hash, { context, options, resolve });
      });
    }

    this._queryTracker.active.push(hash);
  }
}
