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
import { DEFAULT_TYPE_ID_KEY, MUTATION, QUERY, QUERY_RESPONSES, SUBSCRIPTION } from "../consts";
import {
  ConstructorOptions,
  InitOptions,
  PendingQueryData,
  PendingQueryResolver,
  QueryTracker,
  RequestResult,
  SubscribeResult,
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
      const typeIDKey = options.typeIDKey || DEFAULT_TYPE_ID_KEY;

      const constructorOptions: ConstructorOptions = {
        requestManager: await options.requestManager(),
        typeIDKey,
      };

      if (options.cacheManager) {
        constructorOptions.cacheManager = await options.cacheManager({ typeIDKey });
      }

      if (options.debugManager) {
        constructorOptions.debugManager = await options.debugManager();
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
  private _debugManager: debugDefs.DebugManager | undefined;
  private _queryTracker: QueryTracker = { active: [], pending: new Map() };
  private _requestManager: requestDefs.RequestManager;
  private _requestParser: parserDefs.RequestParser | undefined;
  private _subscriptionsManager: subDefs.SubscriptionsManager | undefined;
  private _typeIDKey: string;

  constructor(options: ConstructorOptions) {
    const { cacheManager, debugManager, requestManager, requestParser, subscriptionsManager, typeIDKey } = options;
    if (cacheManager) this._cacheManager = cacheManager;
    if (debugManager) this._debugManager = debugManager;
    this._requestManager = requestManager;
    if (requestParser) this._requestParser = requestParser;
    if (subscriptionsManager) this._subscriptionsManager = subscriptionsManager;
    this._typeIDKey = typeIDKey;
  }

  public async request(request: string, options: coreDefs.RequestOptions = {}): Promise<RequestResult> {
    const errors = Client._validateRequestArguments(request, options);
    if (errors.length) return Promise.reject(errors);

    try {
      return this._request(request, options, Client._getRequestContext(QUERY));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async subscribe(
    request: string,
    options: coreDefs.RequestOptions = {},
  ): Promise<SubscribeResult | RequestResult> {
    const errors = Client._validateRequestArguments(request, options);
    if (errors.length) return Promise.reject(errors);

    try {
      return this._subscribe(request, options, Client._getRequestContext(SUBSCRIPTION));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _handleQuery(
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<RequestResult> {
    try {
      if (this._cacheManager) {
        const checkResult = await this._cacheManager.check(QUERY_RESPONSES, requestData);
        if (checkResult) return this._resolve(checkResult, options, context);
      }

      const pendingQuery = this._trackQuery(requestData, options, context);
      if (pendingQuery) return pendingQuery as Promise<RequestResult>;

      let updatedRequestData: coreDefs.RequestData = requestData;

      if (this._cacheManager) {
        const analyzeQueryResult = await this._cacheManager.analyzeQuery(requestData, options, context);
        const { response, updated } = analyzeQueryResult;

        if (response) {
          return this._resolveQuery(response, options, context);
        } else if (updated) {
          updatedRequestData = updated;
        }
      }

      let responseData = await this._fetch(updatedRequestData, options, context);

      if (this._cacheManager) {
        responseData = await this._cacheManager.resolveQuery(
          requestData,
          updatedRequestData,
          responseData,
          options,
          context,
        );
      }

      return this._resolveQuery(responseData, options, context);
    } catch (error) {
      return this._resolveQuery({ errors: error }, options, context);
    }
  }

  private _handleRequest(
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<RequestResult> {
    try {
      if (context.operation === QUERY) {
        return this._handleQuery(requestData, options, context);
      } else if (context.operation === MUTATION) {
        return this._handleMutation(requestData, options, context);
      } else {
        return Promise.reject(new Error("@handl/client expected the operation to be 'query' or 'mutation'."));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _handleSubscription(
    request: string,
    ast: DocumentNode | undefined,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<SubscribeResult | RequestResult> {
    if (context.operation !== SUBSCRIPTION) {
      return Promise.reject(new Error("@handl/client expected the operation to be 'subscription'."));
    }

    try {
      const resolver = async (result: coreDefs.PlainObjectMap) => this._resolve(result, ast, options, context);
      const subscribeResult = await this._subscriptionsManager.subscribe(request, ast, options, resolver);
      if (isAsyncIterable(subscribeResult)) return subscribeResult as SubscribeResult;

      return this._resolve(subscribeResult as ExecutionResult, ast, options, context);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _request(
    request: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<RequestResult> {
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

  private async _resolve(): Promise<RequestResult> {
    // TODO: Check options.cacheMetadata before returning response data
  }

  private async _resolveQuery(
    responseData: coreDefs.ResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<RequestResult> {
    // TODO: Resolve tracked queries and call _resolve()
  }

  private _setPendingQuery(requestHash: string, data: PendingQueryData): void {
    let pending = this._queryTracker.pending.get(requestHash);
    if (!pending) pending = [];
    pending.push(data);
    this._queryTracker.pending.set(requestHash, pending);
  }

  private async _subscribe(
    request: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<SubscribeResult | RequestResult> {
    try {
      let updateRequest = request;
      let ast;

      if (this._requestParser) {
        const updated = await this._requestParser.updateRequest(request, options, context);
        if (updated.errors.length) return Promise.reject(updated.errors);

        updateRequest = updated.request;
        ast = updated.ast;
      }

      return this._handleSubscription(updateRequest, ast, options, context);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _trackQuery(
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<RequestResult | void> {
    if (this._queryTracker.active.includes(requestData.hash)) {
      return new Promise((resolve: PendingQueryResolver) => {
        this._setPendingQuery(requestData.hash, { context, options, requestData, resolve });
      });
    }

    this._queryTracker.active.push(requestData.hash);
  }
}
