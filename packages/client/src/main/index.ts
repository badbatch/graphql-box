import Core from "@cachemap/core";
import { CacheManagerDef } from "@graphql-box/cache-manager";
import {
  DebugManagerDef,
  DEFAULT_TYPE_ID_KEY,
  MaybeRawResponseData,
  MaybeRequestContext,
  MaybeRequestResult,
  MaybeResponseData,
  MUTATION,
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
import { isArray, isPlainObject, isString } from "lodash";
import uuid from "uuid/v1";
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
    return !!fragments && (!isArray(fragments) || !fragments.every((value) => isString(value)));
  }

  private static _resolve(
    { cacheMetadata, data, errors }: MaybeResponseData,
    options: RequestOptions,
    context: RequestContext,
  ): MaybeRequestResult {
    const result: MaybeRequestResult = { data, errors };
    if (options.returnCacheMetadata && cacheMetadata) result._cacheMetadata = cacheMetadata;
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

  public async request(
    request: string,
    options: RequestOptions = {},
    context: MaybeRequestContext = {},
  ): Promise<MaybeRequestResult> {
    const errors = Client._validateRequestArguments(request, options);
    if (errors.length) return { errors };

    try {
      return this._request(request, options, this._getRequestContext(QUERY, request, context)) as MaybeRequestResult;
    } catch (error) {
      return { errors: error };
    }
  }

  public async subscribe(
    request: string,
    options: RequestOptions = {},
    context: MaybeRequestContext = {},
  ): Promise<AsyncIterator<MaybeRequestResult | undefined>> {
    const errors: Error[] = [];

    if (!this._subscriptionsManager) {
      errors.push(new Error("@graphql-box/client does not have the subscriptions manager module."));
    }

    errors.push(...Client._validateRequestArguments(request, options));
    if (errors.length) return Promise.reject(errors);

    try {
      return await this._request(
        request,
        options,
        this._getRequestContext(SUBSCRIPTION, request, context),
      ) as AsyncIterator<MaybeRequestResult | undefined>;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _getRequestContext(
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
  ): Promise<MaybeRequestResult> {
    try {
      const rawResponseData = await this._requestManager.execute(requestData, options, context);

      const { data, errors } = rawResponseData;
      if (errors) return Promise.reject(errors);

      let responseData = { data };

      responseData = await this._cacheManager.resolveRequest(
        requestData as RequestData,
        rawResponseData as RawResponseDataWithMaybeCacheMetadata,
        options,
        context,
      );

      return Client._resolve(responseData, options, context);
    } catch (errors) {
      return Promise.reject(errors);
    }
  }

  private async _handleQuery(
    requestData: RequestDataWithMaybeAST,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<MaybeRequestResult> {
    try {
      const checkResult = await this._cacheManager.checkQueryResponseCacheEntry(requestData.hash, options, context);

      if (checkResult) return Client._resolve(checkResult, options, context);

      const pendingQuery = this._trackQuery(requestData, options, context);
      if (pendingQuery) return pendingQuery;

      let updatedRequestData: RequestDataWithMaybeAST = requestData;

      const analyzeQueryResult = await this._cacheManager.analyzeQuery(
        requestData as RequestData,
        options,
        context,
      );

      const { response, updated } = analyzeQueryResult;

      if (response) {
        return this._resolveQuery(requestData, response, options, context);
      } else if (updated) {
        updatedRequestData = updated;
      }

      const rawResponseData = await this._requestManager.execute(updatedRequestData, options, context);

      const { data, errors } = rawResponseData;
      if (errors) return this._resolveQuery(updatedRequestData, { errors }, options, context);

      let responseData = { data };

      responseData = await this._cacheManager.resolveQuery(
        requestData as RequestData,
        updatedRequestData as RequestData,
        rawResponseData as RawResponseDataWithMaybeCacheMetadata,
        options,
        context,
      );

      return this._resolveQuery(requestData, responseData, options, context);
    } catch (errors) {
      return this._resolveQuery(requestData, { errors }, options, context);
    }
  }

  private _handleRequest(
    requestData: RequestDataWithMaybeAST,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<AsyncIterator<MaybeRequestResult | undefined> | MaybeRequestResult> {
    try {
      if (context.operation === QUERY) {
        return this._handleQuery(requestData, options, context);
      } else if (context.operation === MUTATION) {
        return this._handleMutation(requestData, options, context);
      } else if (context.operation === SUBSCRIPTION) {
        return this._handleSubscription(requestData, options, context);
      }

      const message = "@graphql-box/client expected the operation to be 'query', 'mutation' or 'subscription.";
      return Promise.reject(new Error(message));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _handleSubscription(
    requestData: RequestDataWithMaybeAST,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<AsyncIterator<MaybeRequestResult | undefined>> {
    try {
      const resolver = async (responseData: MaybeRawResponseData) =>
        this._resolveSubscription(requestData, responseData, options, context);

      const subscriptionsManager = this._subscriptionsManager as SubscriptionsManagerDef;
      return await subscriptionsManager.subscribe(requestData, options, context, resolver);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @logRequest()
  private async _request(
    request: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<AsyncIterator<MaybeRequestResult | undefined> | MaybeRequestResult> {
    try {
      const { ast, request: updateRequest } = await this._requestParser.updateRequest(request, options, context);

      const requestData = { ast, hash: hashRequest(updateRequest), request: updateRequest };
      return this._handleRequest(requestData, options, context);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _resolvePendingRequests(
    { hash }: RequestDataWithMaybeAST,
    responseData: MaybeResponseData,
  ): void {
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
    this._queryTracker.active = this._queryTracker.active.filter((value) => value !== requestData.hash);
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
      const { data, errors } = rawResponseData;
      if (errors) return Client._resolve({ errors }, options, context);

      let responseData = { data };

      responseData = await this._cacheManager.resolveRequest(
        requestData as RequestData,
        rawResponseData as RawResponseDataWithMaybeCacheMetadata,
        options,
        context,
      );

      return Client._resolve(responseData, options, context);
    } catch (errors) {
      return Client._resolve({ errors }, options, context);
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
