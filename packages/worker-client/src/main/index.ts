import WorkerCachemap from "@cachemap/core-worker";
import {
  DebugManagerDef,
  MUTATION,
  MaybeRequestContext,
  MaybeRequestResult,
  QUERY,
  REQUEST_RESOLVED,
  RequestContext,
  RequestOptions,
  SUBSCRIPTION,
  SUBSCRIPTION_RESOLVED,
  ValidOperations,
} from "@graphql-box/core";
import { EventAsyncIterator, deserializeErrors, hashRequest, rehydrateCacheMetadata } from "@graphql-box/helpers";
import EventEmitter from "eventemitter3";
import { castArray, isPlainObject } from "lodash";
import { v1 as uuid } from "uuid";
import { GRAPHQL_BOX, MESSAGE, REQUEST, SUBSCRIBE } from "../consts";
import logRequest from "../debug/log-request";
import logSubscription from "../debug/log-subscription";
import { MessageContext, MessageResponsePayload, PendingResolver, PendingTracker, UserOptions } from "../defs";

export default class WorkerClient {
  private static _getMessageContext({ hasDeferOrStream = false, requestID }: RequestContext): MessageContext {
    return { hasDeferOrStream, requestID };
  }

  private _cache: WorkerCachemap;
  private _debugManager: DebugManagerDef | null;
  private _eventEmitter: EventEmitter;
  private _pending: PendingTracker = new Map();
  private _worker: Worker;

  constructor(options: UserOptions) {
    const errors: TypeError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@graphql-box/client expected options to ba a plain object."));
    }

    if (!options.cache) {
      errors.push(new TypeError("@graphql-box/client expected options.cache."));
    }

    if (!options.worker) {
      errors.push(new TypeError("@graphql-box/client expected options.worker."));
    }

    if (errors.length) {
      throw errors;
    }

    this._cache = options.cache;
    this._debugManager = options.debugManager ? options.debugManager() : null;
    this._eventEmitter = new EventEmitter();
    this._worker = options.worker;
    this._addEventListener();
  }

  get cache(): WorkerCachemap {
    return this._cache;
  }

  public async mutate(request: string, options: RequestOptions = {}, context: MaybeRequestContext = {}) {
    return this._request(request, options, this._getRequestContext(MUTATION, request, context));
  }

  public async query(request: string, options: RequestOptions = {}, context: MaybeRequestContext = {}) {
    return this._request(request, options, this._getRequestContext(QUERY, request, context));
  }

  public async request(request: string, options: RequestOptions = {}, context: MaybeRequestContext = {}) {
    return this._request(request, options, this._getRequestContext(QUERY, request, context));
  }

  public async subscribe(request: string, options: RequestOptions = {}) {
    return this._subscribe(request, options, this._getRequestContext(SUBSCRIPTION, request));
  }

  private _addEventListener(): void {
    this._worker.addEventListener(MESSAGE, this._onMessage);
  }

  private _getRequestContext(
    operation: ValidOperations,
    request: string,
    context: MaybeRequestContext = {},
  ): RequestContext {
    return {
      debugManager: this._debugManager,
      fieldTypeMap: new Map(),
      operation,
      operationName: "",
      queryFiltered: false,
      request,
      requestID: uuid(),
      whitelistHash: hashRequest(request),
      ...context,
    };
  }

  private _onMessage = async ({ data }: MessageEvent): Promise<void> => {
    if (!isPlainObject(data)) {
      return;
    }

    const { context, method, result, type } = data as MessageResponsePayload;

    if (type !== GRAPHQL_BOX || !isPlainObject(result)) {
      return;
    }

    const { _cacheMetadata, ...otherProps } = result;
    const response: MaybeRequestResult = deserializeErrors({ ...otherProps, requestID: context.requestID });

    if (_cacheMetadata) {
      response._cacheMetadata = rehydrateCacheMetadata(_cacheMetadata);
    }

    if (method === SUBSCRIBE) {
      this._debugManager?.log(SUBSCRIPTION_RESOLVED, {
        context,
        result: response,
        stats: { endTime: this._debugManager?.now() },
      });

      this._eventEmitter.emit(context.requestID, response);
    } else if (context.hasDeferOrStream) {
      this._debugManager?.log(REQUEST_RESOLVED, {
        context,
        result: response,
        stats: { endTime: this._debugManager?.now() },
      });

      this._eventEmitter.emit(context.requestID, response);
    } else {
      const pending = this._pending.get(context.requestID);

      if (!pending) {
        return;
      }

      pending.resolve(response);
    }
  };

  @logRequest()
  private async _request(request: string, options: RequestOptions, context: RequestContext) {
    try {
      if (!context.hasDeferOrStream) {
        return new Promise((resolve: PendingResolver) => {
          this._worker.postMessage({
            context: WorkerClient._getMessageContext(context),
            method: REQUEST,
            options,
            request,
            type: GRAPHQL_BOX,
          });

          this._pending.set(context.requestID, { resolve });
        });
      }

      this._worker.postMessage({
        context: WorkerClient._getMessageContext(context),
        method: REQUEST,
        options,
        request,
        type: GRAPHQL_BOX,
      });

      const eventAsyncIterator = new EventAsyncIterator<MaybeRequestResult>(this._eventEmitter, context.requestID);
      return eventAsyncIterator.getIterator();
    } catch (error) {
      return { errors: castArray(error) };
    }
  }

  @logSubscription()
  private async _subscribe(request: string, options: RequestOptions, context: RequestContext) {
    try {
      this._worker.postMessage({
        context: WorkerClient._getMessageContext(context),
        method: SUBSCRIBE,
        options,
        request,
        type: GRAPHQL_BOX,
      });

      const eventAsyncIterator = new EventAsyncIterator<MaybeRequestResult>(this._eventEmitter, context.requestID);
      return eventAsyncIterator.getIterator();
    } catch (error) {
      return { errors: castArray(error) };
    }
  }
}
