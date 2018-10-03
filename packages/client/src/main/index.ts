import { cacheDefs } from "@handl/cache-manager";
import { coreDefs } from "@handl/core";
import { debugDefs } from "@handl/debug-manager";
import { requestDefs } from "@handl/request-manager";
import { parserDefs } from "@handl/request-parser";
import { isArray, isPlainObject, isString } from "lodash";
import uuid from "uuid/v1";
import { DEFAULT_TYPE_ID_KEY, QUERY, SUBSCRIPTION } from "../consts";
import {
  ConstructorOptions,
  InitOptions,
  RequestResult,
  RequestTracker,
  SubscribeResult,
} from "../defs";

export default class Client {
  public static async init(options: InitOptions): Promise<Client> {
    const errors: TypeError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@handl/client expected options to ba a plain object."));
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

  private static _getRequestContext(operationName: coreDefs.ValidOperation): coreDefs.RequestContext {
    return {
      fieldTypeMap: new Map(),
      handlID: uuid(),
      operation: operationName,
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
  private _requestManager: requestDefs.RequestManager;
  private _requestParser: parserDefs.RequestParser | undefined;
  private _requestTracker: RequestTracker = { active: new Map(), pending: new Map() };
  private _subscriptionsManager: SubscriptionsManager | undefined;
  private _typeIDKey: string;

  constructor(options: ConstructorOptions) {
    const { cacheManager, debugManager, requestManager, requestParser, subscriptionsManager, typeIDKey } = options;

    if (requestParser) this._requestParser = requestParser;
    this._typeIDKey = typeIDKey;
    // TODO
  }

  public async request(query: string, options: coreDefs.RequestOptions = {}): Promise<RequestResult> {
    const errors = Client._validateRequestArguments(query, options);
    if (errors.length) return Promise.reject(errors);

    return this._request(query, options, Client._getRequestContext(QUERY));
  }

  public async subscribe(query: string, options: coreDefs.RequestOptions = {}): Promise<SubscribeResult> {
    const errors = Client._validateRequestArguments(query, options);
    if (errors.length) return Promise.reject(errors);

    return this._subscribe(query, options, Client._getRequestContext(SUBSCRIPTION));
  }

  private async _request(
    query: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<RequestResult> {
    try {
      const updated = await this._requestParser.updateQuery(query, options, context);
      if (updated.errors.length) return Promise.reject(updated.errors);

      const result = await this._resolveRequest(updated.query, updated.ast, options, context);
      if (options.awaitDataCaching && result.cachingPromise) await result.cachePromise;
      delete result.cachePromise;
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _subscribe(
    query: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<SubscribeResult> {
    try {
      const updated = await this._requestParser.updateQuery(query, options, context);
      if (updated.errors.length) return Promise.reject(updated.errors);

      return this._resolveSubscription(updated.query, updated.ast, options, context);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
