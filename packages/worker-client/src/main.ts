import { type CoreWorker } from '@cachemap/core-worker';
import { type CacheManagerDef } from '@graphql-box/cache-manager';
import {
  type DebugManagerDef,
  type PartialRequestContext,
  type PartialRequestResult,
  type PartialResponseData,
  REQUEST_RESOLVED,
  type RawResponseDataWithMaybeCacheMetadata,
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
import { type RequestParserDef } from '@graphql-box/request-parser';
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
  private static _getMessageContext({
    hasDeferOrStream = false,
    initiator,
    operation,
    requestID,
  }: RequestContext): MessageContext {
    return { hasDeferOrStream, initiator, operation, requestID };
  }

  private static _resolve(
    { cacheMetadata, ...rest }: PartialResponseData,
    options: RequestOptions,
    { requestID }: RequestContext,
  ): PartialRequestResult {
    const result: PartialRequestResult = { ...rest, requestID };

    if (options.returnCacheMetadata && cacheMetadata) {
      result._cacheMetadata = cacheMetadata;
    }

    return result;
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

      if (context.operation === OperationTypeNode.QUERY && pending.requestData && pending.options && pending.context) {
        void this._cacheManager.cacheQuery(
          pending.requestData,
          undefined,
          // Need to look at what type guards can be put in place
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          response as RawResponseDataWithMaybeCacheMetadata,
          pending.options,
          pending.context,
        );
      }

      pending.resolve(response);
    }
  };

  /**
   * This cache instance does not actually store anything itself,
   * it is for communicating with the worker cache that the worker
   * client is using within the worker.
   */
  private _cache: CoreWorker;
  private _cacheManager: CacheManagerDef;
  private _debugManager: DebugManagerDef | null;
  private _eventEmitter: EventEmitter;
  private _experimentalDeferStreamSupport: boolean;
  private _messageQueue: MessageRequestPayload[] = [];
  private _pending: PendingTracker = new Map();
  private _requestParser: RequestParserDef;
  private _worker: Worker | undefined;

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@graphql-box/worker-client expected options to ba a plain object.'));
    }

    if (!('cache' in options)) {
      errors.push(new ArgsError('@graphql-box/worker-client expected options.cache.'));
    }

    if (!('cacheManager' in options)) {
      errors.push(new ArgsError('@graphql-box/worker-client expected options.cacheManager.'));
    }

    if (!('requestParser' in options)) {
      errors.push(new ArgsError('@graphql-box/worker-client expected options.requestParser.'));
    }

    if (!options.lazyWorkerInit && !('worker' in options)) {
      errors.push(new ArgsError('@graphql-box/worker-client expected options.worker.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/worker-client argument validation errors.', errors);
    }

    this._cache = options.cache;
    this._cacheManager = options.cacheManager;
    this._debugManager = options.debugManager ?? null;
    this._eventEmitter = new EventEmitter();
    this._experimentalDeferStreamSupport = options.experimentalDeferStreamSupport ?? false;
    this._requestParser = options.requestParser;

    if (typeof options.worker === 'function') {
      Promise.resolve(options.worker())
        .then(worker => {
          this._worker = worker;
          this._addEventListener();
          this._releaseMessageQueue();
        })
        .catch((error: unknown) => {
          throw error;
        });
    } else if (options.worker) {
      this._worker = options.worker;
      this._addEventListener();
    }
  }

  get cache(): CoreWorker {
    return this._cache;
  }

  get cacheManager(): CacheManagerDef {
    return this._cacheManager;
  }

  public async mutate(request: string, options: RequestOptions = {}, context: PartialRequestContext = {}) {
    return this._request(request, options, this._getRequestContext(OperationTypeNode.MUTATION, request, context));
  }

  public async query(request: string, options: RequestOptions = {}, context: PartialRequestContext = {}) {
    return this._query(request, options, this._getRequestContext(OperationTypeNode.QUERY, request, context));
  }

  public async request(request: string, options: RequestOptions = {}, context: PartialRequestContext = {}) {
    return this._request(request, options, this._getRequestContext(OperationTypeNode.QUERY, request, context));
  }

  public async subscribe(request: string, options: RequestOptions = {}) {
    return this._subscribe(request, options, this._getRequestContext(OperationTypeNode.SUBSCRIPTION, request));
  }

  public set worker(worker: Worker) {
    this._worker = worker;
    this._addEventListener();
    this._releaseMessageQueue();
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

  private async _query(
    request: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<PartialRequestResult | AsyncIterableIterator<PartialRequestResult | undefined>> {
    try {
      const { ast, request: updateRequest } = this._requestParser.updateRequest(request, options, context);
      const requestData = { ast, hash: hashRequest(updateRequest), request: updateRequest };
      const checkResult = await this._cacheManager.checkQueryResponseCacheEntry(requestData.hash, options, context);

      if (checkResult) {
        return WorkerClient._resolve(checkResult, options, context);
      }

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

        this._pending.set(context.requestID, { context, options, requestData, resolve });
      });
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/worker-client request had an unexpected error.');

      return { errors: [confirmedError], requestID: context.requestID };
    }
  }

  private _releaseMessageQueue(): void {
    if (!this._worker) {
      throw new Error('A worker is required for the WorkerClient to work correctly.');
    }

    const messageQueue = [...this._messageQueue];
    this._messageQueue = [];

    for (const message of messageQueue) {
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
