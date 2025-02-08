import { type CoreWorker } from '@cachemap/core-worker';
import {
  type DebugManagerDef,
  type PartialRequestContext,
  type PartialRequestResult,
  REQUEST_RESOLVED,
  type RequestContext,
  type RequestOptions,
  SUBSCRIPTION_RESOLVED,
} from '@graphql-box/core';
import {
  ArgsError,
  EventAsyncIterator,
  GroupedError,
  deserializeErrors,
  hashRequest,
  isPlainObject,
  rehydrateCacheMetadata,
} from '@graphql-box/helpers';
import { EventEmitter } from 'eventemitter3';
import { OperationTypeNode } from 'graphql';
import { isError } from 'lodash-es';
import { v4 as uuid } from 'uuid';
import { GRAPHQL_BOX, MESSAGE, REQUEST, SUBSCRIBE } from './constants.ts';
import { logRequest } from './debug/logRequest.ts';
import { logSubscription } from './debug/logSubscription.ts';
import {
  type MessageContext,
  type MessageRequestPayload,
  type MessageResponsePayload,
  type PendingResolver,
  type PendingTracker,
  type UserOptions,
} from './types.ts';

export class WorkerClient {
  private static _getMessageContext({ hasDeferOrStream = false, requestID }: RequestContext): MessageContext {
    return { hasDeferOrStream, requestID };
  }

  private _onMessage = ({ data }: MessageEvent<MessageResponsePayload>): void => {
    if (!isPlainObject(data)) {
      return;
    }

    const { context, method, result, type } = data;

    if (type !== GRAPHQL_BOX) {
      return;
    }

    const { _cacheMetadata, ...otherProps } = result;
    const response: PartialRequestResult = { ...deserializeErrors(otherProps), requestID: context.requestID };

    if (_cacheMetadata) {
      response._cacheMetadata = rehydrateCacheMetadata(_cacheMetadata);
    }

    if (method === SUBSCRIBE) {
      this._debugManager?.log(SUBSCRIPTION_RESOLVED, {
        context,
        result: response,
        stats: { endTime: this._debugManager.now() },
      });

      this._eventEmitter.emit(context.requestID, response);
    } else if (context.hasDeferOrStream) {
      const pending = this._pending.get(context.requestID);

      if (pending) {
        const eventAsyncIterator = new EventAsyncIterator<PartialRequestResult>(this._eventEmitter, context.requestID);
        pending.resolve(eventAsyncIterator.getIterator());
      }

      this._debugManager?.log(REQUEST_RESOLVED, {
        context,
        result: response,
        stats: { endTime: this._debugManager.now() },
      });

      this._eventEmitter.emit(context.requestID, response);
    } else {
      const pending = this._pending.get(context.requestID);

      if (!pending) {
        return;
      }

      this._debugManager?.log(REQUEST_RESOLVED, {
        context,
        result: response,
        stats: { endTime: this._debugManager.now() },
      });

      pending.resolve(response);
    }
  };

  private _cache: CoreWorker;
  private _debugManager: DebugManagerDef | null;
  private _eventEmitter: EventEmitter;
  private _experimentalDeferStreamSupport: boolean;
  private _messageQueue: MessageRequestPayload[] = [];
  private _pending: PendingTracker = new Map();

  private _worker: Worker | undefined;

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@graphql-box/worker-client expected options to ba a plain object.'));
    }

    if (!('cache' in options)) {
      errors.push(new ArgsError('@graphql-box/worker-client expected options.cache.'));
    }

    if (!('worker' in options)) {
      errors.push(new ArgsError('@graphql-box/worker-client expected options.worker.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/worker-client argument validation errors.', errors);
    }

    this._cache = options.cache;
    this._debugManager = options.debugManager ?? null;
    this._eventEmitter = new EventEmitter();
    this._experimentalDeferStreamSupport = options.experimentalDeferStreamSupport ?? false;

    if (typeof options.worker === 'function') {
      options
        .worker()
        .then(worker => {
          this._worker = worker;
          this._addEventListener();
          this._releaseMessageQueue();
        })
        .catch((error: unknown) => {
          throw error;
        });
    } else {
      this._worker = options.worker;
      this._addEventListener();
    }
  }

  get cache(): CoreWorker {
    return this._cache;
  }

  public async mutate(request: string, options: RequestOptions = {}, context: PartialRequestContext = {}) {
    return this._request(request, options, this._getRequestContext(OperationTypeNode.MUTATION, request, context));
  }

  public async query(request: string, options: RequestOptions = {}, context: PartialRequestContext = {}) {
    return this._request(request, options, this._getRequestContext(OperationTypeNode.QUERY, request, context));
  }

  public async request(request: string, options: RequestOptions = {}, context: PartialRequestContext = {}) {
    return this._request(request, options, this._getRequestContext(OperationTypeNode.QUERY, request, context));
  }

  public async subscribe(request: string, options: RequestOptions = {}) {
    return this._subscribe(request, options, this._getRequestContext(OperationTypeNode.SUBSCRIPTION, request));
  }

  private _addEventListener(): void {
    if (!this._worker) {
      throw new Error('A worker is required for the WorkerClient to work correctly.');
    }

    this._worker.addEventListener(MESSAGE, this._onMessage);
  }

  private _getRequestContext(
    operation: OperationTypeNode,
    request: string,
    context: PartialRequestContext = {},
  ): RequestContext {
    return {
      debugManager: this._debugManager,
      experimentalDeferStreamSupport: this._experimentalDeferStreamSupport,
      fieldTypeMap: new Map(),
      filteredRequest: '',
      operation,
      operationName: '',
      originalRequestHash: hashRequest(request),
      parsedRequest: '',
      queryFiltered: false,
      request,
      requestComplexity: null,
      requestDepth: null,
      requestID: uuid(),
      ...context,
    };
  }

  private _releaseMessageQueue(): void {
    if (!this._worker) {
      throw new Error('A worker is required for the WorkerClient to work correctly.');
    }

    for (const message of this._messageQueue) {
      this._worker.postMessage(message);
    }
  }

  @logRequest()
  private async _request(
    request: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<PartialRequestResult | AsyncIterableIterator<PartialRequestResult | undefined>> {
    try {
      return await new Promise((resolve: PendingResolver) => {
        if (this._worker) {
          this._worker.postMessage({
            context: WorkerClient._getMessageContext(context),
            method: REQUEST,
            options,
            request,
            type: GRAPHQL_BOX,
          });
        } else {
          this._messageQueue.push({
            context: WorkerClient._getMessageContext(context),
            method: REQUEST,
            options,
            request,
            type: GRAPHQL_BOX,
          });
        }

        this._pending.set(context.requestID, { resolve });
      });
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/worker-client request had an unexpected error.');

      return { errors: [confirmedError], requestID: context.requestID };
    }
  }

  @logSubscription()
  private _subscribe(
    request: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<PartialRequestResult | AsyncIterableIterator<PartialRequestResult | undefined>> {
    try {
      if (this._worker) {
        this._worker.postMessage({
          context: WorkerClient._getMessageContext(context),
          method: SUBSCRIBE,
          options,
          request,
          type: GRAPHQL_BOX,
        });
      } else {
        this._messageQueue.push({
          context: WorkerClient._getMessageContext(context),
          method: SUBSCRIBE,
          options,
          request,
          type: GRAPHQL_BOX,
        });
      }

      const eventAsyncIterator = new EventAsyncIterator<PartialRequestResult>(this._eventEmitter, context.requestID);
      return Promise.resolve(eventAsyncIterator.getIterator());
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/worker-client subscribe had an unexpected error.');

      return Promise.resolve({ errors: [confirmedError], requestID: context.requestID });
    }
  }
}
