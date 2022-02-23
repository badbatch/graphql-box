import WorkerCachemap from "@cachemap/core-worker";
import {
  DebugManagerDef,
  MaybeRequestContext,
  MaybeRequestResult,
  QUERY,
  RequestContext,
  RequestOptions,
  SUBSCRIPTION,
  ValidOperations,
} from "@graphql-box/core";
import { EventAsyncIterator, rehydrateCacheMetadata } from "@graphql-box/helpers";
import EventEmitter from "eventemitter3";
import { isPlainObject } from "lodash";
import { v1 as uuid } from "uuid";
import { GRAPHQL_BOX, MESSAGE, REQUEST, SUBSCRIBE } from "../consts";
import logRequest from "../debug/log-request";
import {
  ConstructorOptions,
  MessageContext,
  MessageResponsePayload,
  PendingResolver,
  PendingTracker,
  UserOptions,
} from "../defs";

export default class WorkerClient {
  public static async init(options: UserOptions): Promise<WorkerClient> {
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

    const constructorOptions: ConstructorOptions = {
      cache: options.cache,
      worker: options.worker,
    };

    try {
      if (options.debugManager) {
        constructorOptions.debugManager = await options.debugManager();
      }

      return new WorkerClient(constructorOptions);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private static _getMessageContext({ boxID, hasDeferOrStream = false }: RequestContext): MessageContext {
    return { boxID, hasDeferOrStream };
  }

  private _cache: WorkerCachemap;
  private _debugManager: DebugManagerDef | null;
  private _eventEmitter: EventEmitter;
  private _pending: PendingTracker = new Map();
  private _worker: Worker;

  constructor({ cache, debugManager, worker }: ConstructorOptions) {
    this._cache = cache;
    this._debugManager = debugManager || null;
    this._eventEmitter = new EventEmitter();
    this._worker = worker;
    this._addEventListener();
  }

  get cache(): WorkerCachemap {
    return this._cache;
  }

  public async request(request: string, options: RequestOptions = {}, context: MaybeRequestContext = {}) {
    try {
      return this._request(request, options, this._getRequestContext(QUERY, request, context));
    } catch (error) {
      return { errors: error };
    }
  }

  public async subscribe(
    request: string,
    options: RequestOptions = {},
  ): Promise<AsyncIterator<MaybeRequestResult | undefined>> {
    try {
      return (await this._subscribe(request, options, this._getRequestContext(SUBSCRIPTION, request))) as AsyncIterator<
        MaybeRequestResult | undefined
      >;
    } catch (error) {
      return Promise.reject(error);
    }
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

  private _onMessage = async ({ data }: MessageEvent): Promise<void> => {
    if (!isPlainObject(data)) return;

    const { context, method, result, type } = data as MessageResponsePayload;

    if (type !== GRAPHQL_BOX || !isPlainObject(result)) {
      return;
    }

    const { _cacheMetadata, ...otherProps } = result;
    const response: MaybeRequestResult = { ...otherProps, requestID: context.boxID };

    if (_cacheMetadata) {
      response._cacheMetadata = rehydrateCacheMetadata(_cacheMetadata);
    }

    if (method === REQUEST) {
      const pending = this._pending.get(context.boxID);

      if (!pending) {
        return;
      }

      pending.resolve(response);
    } else if (method === SUBSCRIBE || context.hasDeferOrStream) {
      this._eventEmitter.emit(context.boxID, response);
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

          this._pending.set(context.boxID, { resolve });
        });
      }

      this._worker.postMessage({
        context: WorkerClient._getMessageContext(context),
        method: REQUEST,
        options,
        request,
        type: GRAPHQL_BOX,
      });

      const eventAsyncIterator = new EventAsyncIterator<MaybeRequestResult>(this._eventEmitter, context.boxID);
      return eventAsyncIterator.getIterator();
    } catch (errors) {
      return { errors };
    }
  }

  @logRequest()
  private async _subscribe(
    request: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<AsyncIterator<MaybeRequestResult | undefined>> {
    try {
      this._worker.postMessage({
        context: WorkerClient._getMessageContext(context),
        method: SUBSCRIBE,
        options,
        request,
        type: GRAPHQL_BOX,
      });

      const eventAsyncIterator = new EventAsyncIterator<MaybeRequestResult>(this._eventEmitter, context.boxID);
      return eventAsyncIterator.getIterator();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
