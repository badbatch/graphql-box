import WorkerCachemap from "@cachemap/core-worker";
import {
  DebugManagerDef,
  MaybeRequestResult,
  QUERY,
  RequestContext,
  RequestOptions,
  SUBSCRIPTION,
  ValidOperations,
} from "@handl/core";
import { EventAsyncIterator, rehydrateCacheMetadata } from "@handl/helpers";
import EventEmitter from "eventemitter3";
import { isPlainObject } from "lodash";
import uuid from "uuid/v1";
import { HANDL, MESSAGE, REQUEST, SUBSCRIBE } from "../consts";
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
      errors.push(new TypeError("@handl/client expected options to ba a plain object."));
    }

    if (!options.worker) {
      errors.push(new TypeError("@handl/client expected options.worker."));
    }

    const constructorOptions: ConstructorOptions = {
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

  private static _getMessageContext({ handlID }: RequestContext): MessageContext {
    return { handlID };
  }

  private _cache: WorkerCachemap;
  private _debugManager: DebugManagerDef | null;
  private _eventEmitter: EventEmitter;
  private _pending: PendingTracker = new Map();
  private _worker: Worker;

  constructor({ debugManager, worker }: ConstructorOptions) {
    this._cache = new WorkerCachemap({ worker });
    this._debugManager = debugManager || null;
    this._eventEmitter = new EventEmitter();
    this._worker = worker;
    this._addEventListener();
  }

  get cache(): WorkerCachemap {
    return this._cache;
  }

  public async request(
    request: string,
    options: RequestOptions = {},
  ): Promise<MaybeRequestResult> {
    try {
      return this._request(request, options, this._getRequestContext(QUERY, request)) as MaybeRequestResult;
    } catch (error) {
      return { errors: error };
    }
  }

  public async subscribe(
    request: string,
    options: RequestOptions = {},
  ): Promise<AsyncIterator<MaybeRequestResult | undefined>> {
    try {
      return await this._subscribe(
        request,
        options,
        this._getRequestContext(SUBSCRIPTION, request),
      ) as AsyncIterator<MaybeRequestResult | undefined>;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _addEventListener(): void {
    this._worker.addEventListener(MESSAGE, this._onMessage);
  }

  private _getRequestContext(operation: ValidOperations, request: string): RequestContext {
    return {
      debugManager: this._debugManager,
      fieldTypeMap: new Map(),
      handlID: uuid(),
      operation,
      operationName: "",
      queryFiltered: false,
      request,
    };
  }

  private _onMessage = async ({ data }: MessageEvent): Promise<void> => {
    if (!isPlainObject(data)) return;

    const { context, method, result, type } = data as MessageResponsePayload;
    if (type !== HANDL || !isPlainObject(result)) return;

    const { _cacheMetadata, ...otherProps } = result;
    const response: MaybeRequestResult = { ...otherProps };
    if (_cacheMetadata) response._cacheMetadata = rehydrateCacheMetadata(_cacheMetadata);

    if (method === REQUEST) {
      const pending = this._pending.get(context.handlID);
      if (!pending) return;

      pending.resolve(response);
    } else if (method === SUBSCRIBE) {
      this._eventEmitter.emit(context.handlID, response);
    }
  }

  @logRequest()
  private async _request(
    request: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<MaybeRequestResult> {
    try {
      return new Promise((resolve: PendingResolver) => {
        this._worker.postMessage({
          context: WorkerClient._getMessageContext(context),
          method: REQUEST,
          options,
          request,
          type: HANDL,
        });

        this._pending.set(context.handlID, { resolve });
      });
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
        type: HANDL,
      });

      const eventAsyncIterator = new EventAsyncIterator(this._eventEmitter, context.handlID);
      return eventAsyncIterator.getIterator();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}