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
import { isError, merge } from 'lodash-es';
import { v4 as uuid } from 'uuid';
import { GRAPHQL_BOX, MESSAGE, REQUEST, SUBSCRIBE } from './constants.ts';
import { logRequest } from './debug/logRequest.ts';
import { logSubscription } from './debug/logSubscription.ts';
import {
  type MessageRequestPayload,
  type MessageResponsePayload,
  type PendingResolver,
  type PendingTracker,
  type UserOptions,
} from './types.ts';

export class WorkerClient {
  private static _resolve(
    { cacheMetadata, ...rest }: PartialResponseData,
    options: RequestOptions,
    { data }: RequestContext,
  ): PartialRequestResult {
    const result: PartialRequestResult = { ...rest, requestID: data.requestID };

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

    const { operation, requestID } = context.data;
    const { hasDeferOrStream } = context.deprecated;
    const { _cacheMetadata, ...otherProps } = result;
    const response: PartialRequestResult = { ...deserializeErrors(otherProps), requestID };

    if (_cacheMetadata) {
      response._cacheMetadata = rehydrateCacheMetadata(_cacheMetadata);
    }

    if (method === SUBSCRIBE) {
      this._debugManager?.log(SUBSCRIPTION_RESOLVED, {
        data: context.data,
        stats: { endTime: this._debugManager.now() },
      });

      this._eventEmitter.emit(requestID, response);
    } else if (hasDeferOrStream) {
      const pending = this._pending.get(requestID);

      if (pending) {
        const eventAsyncIterator = new EventAsyncIterator<PartialRequestResult>(this._eventEmitter, requestID);
        pending.resolve(eventAsyncIterator.getIterator());
      }

      this._debugManager?.log(REQUEST_RESOLVED, {
        data: context.data,
        stats: { endTime: this._debugManager.now() },
      });

      this._eventEmitter.emit(requestID, response);
    } else {
      const pending = this._pending.get(requestID);

      if (!pending) {
        return;
      }

      this._debugManager?.log(REQUEST_RESOLVED, {
        data: context.data,
        stats: { endTime: this._debugManager.now() },
      });

      if (operation === OperationTypeNode.QUERY && pending.requestData && pending.options && pending.context) {
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
  private readonly _cache: CoreWorker;
  private readonly _cacheManager: CacheManagerDef;
  private readonly _debugManager: DebugManagerDef | undefined;
  private readonly _eventEmitter: EventEmitter;
  private readonly _experimentalDeferStreamSupport: boolean;
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
    this._debugManager = options.debugManager;
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
    return this._request(
      request,
      options,
      this._getRequestContext(OperationTypeNode.MUTATION, request, options, context),
    );
  }

  public async query(request: string, options: RequestOptions = {}, context: PartialRequestContext = {}) {
    return this._query(request, options, this._getRequestContext(OperationTypeNode.QUERY, request, options, context));
  }

  public async request(request: string, options: RequestOptions = {}, context: PartialRequestContext = {}) {
    return this._request(request, options, this._getRequestContext(OperationTypeNode.QUERY, request, options, context));
  }

  public async subscribe(request: string, options: RequestOptions = {}, context: PartialRequestContext = {}) {
    return this._subscribe(
      request,
      options,
      this._getRequestContext(OperationTypeNode.SUBSCRIPTION, request, options, context),
    );
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
    options: RequestOptions,
    context: PartialRequestContext,
  ): RequestContext {
    return merge(
      {
        data: {
          batched: options.batch,
          operation,
          operationName: '',
          originalRequestHash: hashRequest(request),
          queryFiltered: false,
          requestComplexity: undefined,
          requestDepth: undefined,
          requestID: uuid(),
          tag: options.tag,
          variables: options.variables,
        },
        debugManager: this._debugManager,
        deprecated: {
          experimentalDeferStreamSupport: this._experimentalDeferStreamSupport,
        },
        fieldTypeMap: new Map(),
        filteredRequest: '',
        parsedRequest: '',
        request,
      },
      context,
    );
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
            context: {
              data: context.data,
              deprecated: context.deprecated,
            },
            method: REQUEST,
            options,
            request,
            type: GRAPHQL_BOX,
          });
        } else {
          this._messageQueue.push({
            context: {
              data: context.data,
              deprecated: context.deprecated,
            },
            method: REQUEST,
            options,
            request,
            type: GRAPHQL_BOX,
          });
        }

        this._pending.set(context.data.requestID, { context, options, requestData, resolve });
      });
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/worker-client request had an unexpected error.');

      return { errors: [confirmedError], requestID: context.data.requestID };
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
    { data, deprecated }: RequestContext,
  ): Promise<PartialRequestResult | AsyncIterableIterator<PartialRequestResult | undefined>> {
    try {
      return await new Promise((resolve: PendingResolver) => {
        if (this._worker) {
          this._worker.postMessage({
            context: {
              data,
              deprecated,
            },
            method: REQUEST,
            options,
            request,
            type: GRAPHQL_BOX,
          });
        } else {
          this._messageQueue.push({
            context: {
              data,
              deprecated,
            },
            method: REQUEST,
            options,
            request,
            type: GRAPHQL_BOX,
          });
        }

        this._pending.set(data.requestID, { resolve });
      });
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/worker-client request had an unexpected error.');

      return { errors: [confirmedError], requestID: data.requestID };
    }
  }

  @logSubscription()
  private _subscribe(
    request: string,
    options: RequestOptions,
    { data, deprecated }: RequestContext,
  ): Promise<PartialRequestResult | AsyncIterableIterator<PartialRequestResult | undefined>> {
    try {
      if (this._worker) {
        this._worker.postMessage({
          context: {
            data,
            deprecated,
          },
          method: SUBSCRIBE,
          options,
          request,
          type: GRAPHQL_BOX,
        });
      } else {
        this._messageQueue.push({
          context: {
            data,
            deprecated,
          },
          method: SUBSCRIBE,
          options,
          request,
          type: GRAPHQL_BOX,
        });
      }

      const eventAsyncIterator = new EventAsyncIterator<PartialRequestResult>(this._eventEmitter, data.requestID);

      return Promise.resolve(eventAsyncIterator.getIterator());
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/worker-client subscribe had an unexpected error.');

      return Promise.resolve({ errors: [confirmedError], requestID: data.requestID });
    }
  }
}
