import {
  FETCH_RESOLVED,
  type LogLevel,
  type PartialRawFetchData,
  type PartialRawResponseData,
  type PartialRequestResult,
  type PlainObject,
  type RequestContext,
  type RequestData,
  type RequestOptions,
  type RequestResolver,
} from '@graphql-box/core';
import { ArgsError, EventAsyncIterator, GroupedError, deserializeErrors } from '@graphql-box/helpers';
import { EventEmitter } from 'eventemitter3';
import { forAwaitEach, isAsyncIterable } from 'iterall';
import { isString } from 'lodash-es';
// @ts-expect-error package.json type mapping incorrect
import { meros } from 'meros/browser';
import { v4 as uuidv4 } from 'uuid';
import { logFetch } from './debug/logFetch.ts';
import { cleanPatchResponse } from './helpers/cleanPatchResponse.ts';
import { mergeResponseDataSets } from './helpers/mergeResponseDataSets.ts';
import { parseFetchResult } from './helpers/parseFetchResult.ts';
import {
  type ActiveBatch,
  type ActiveBatchValue,
  type BatchActionsObjectMap,
  type BatchResultActions,
  type BatchedMaybeFetchData,
  type UserOptions,
} from './types.ts';

export class FetchManager {
  private static _getMessageContext({ operation, originalRequestHash, requestID }: RequestContext) {
    return { operation, originalRequestHash, requestID };
  }

  private static _rejectBatchEntries(batchEntries: BatchActionsObjectMap, error: unknown): void {
    for (const hash of Object.keys(batchEntries)) {
      const { reject } = batchEntries[hash]!;
      reject(error);
    }
  }

  private static _resolveFetchBatch(
    { headers, responses }: BatchedMaybeFetchData,
    batchEntries: BatchActionsObjectMap
  ): void {
    for (const hash of Object.keys(batchEntries)) {
      const responseData = responses[hash];
      const { reject, resolve } = batchEntries[hash]!;

      if (responseData) {
        resolve(deserializeErrors({ headers, ...responseData }));
      } else {
        reject(new Error(`@graphql-box/fetch-manager did not get a response for batched request ${hash}.`));
      }
    }
  }

  private _activeRequestBatch: Record<string, ActiveBatch | undefined> = {};
  private _activeRequestBatchTimer: Record<string, NodeJS.Timeout | undefined> = {};
  private _activeResponseBatch: Set<PartialRawFetchData> | undefined;
  private _activeResponseBatchTimer: NodeJS.Timeout | undefined;
  private _apiUrl: string | undefined;
  private _batchRequests: boolean;
  private _batchResponses: boolean;
  private _eventEmitter: EventEmitter;
  private _fetchTimeout: number;
  private _headers: Record<string, string> = { 'content-type': 'application/json' };
  private _logUrl: string | undefined;
  private _requestBatchInterval: number;
  private _requestBatchMax: number;
  private _responseBatchInterval: number;

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    if (!isString(options.apiUrl) && !isString(options.logUrl)) {
      errors.push(new ArgsError('@graphql-box/fetch-manager expected apiUrl or logUrl to be a string.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/fetch-manager argument validation errors.', errors);
    }

    this._apiUrl = options.apiUrl;
    this._batchRequests = options.batchRequests ?? false;
    this._batchResponses = options.batchResponses ?? true;
    this._eventEmitter = new EventEmitter();
    this._fetchTimeout = options.fetchTimeout ?? 5000;
    this._headers = { ...this._headers, ...options.headers };
    this._logUrl = options.logUrl;
    this._requestBatchInterval = options.requestBatchInterval ?? 100;
    this._requestBatchMax = options.requestBatchMax ?? 20;
    this._responseBatchInterval = options.responseBatchInterval ?? 100;
  }

  @logFetch()
  public async execute(
    { hash, request }: RequestData,
    options: RequestOptions,
    context: RequestContext,
    executeResolver: RequestResolver
  ) {
    const url = this._apiUrl!;

    if (options.batch === false || !this._batchRequests || context.hasDeferOrStream) {
      const fetchResult = await this._fetch(`${url}?requestId=${hash}`, {
        batched: false,
        context: FetchManager._getMessageContext(context),
        request,
      });

      const { debugManager, ...otherContext } = context;

      if (!isAsyncIterable(fetchResult)) {
        return deserializeErrors(fetchResult);
      }

      void forAwaitEach(fetchResult, ({ body, headers }) => {
        const responseData = { headers, ...body } as unknown as PartialRawFetchData;

        const decoratedExecuteResolver = (result: PartialRawResponseData) => {
          const { headers: resultHeaders, ...otherResult } = result;

          debugManager?.log(FETCH_RESOLVED, {
            context: otherContext,
            options,
            requestHash: hash,
            result: otherResult,
            stats: { endTime: debugManager.now() },
          });

          return executeResolver(result);
        };

        if (this._batchResponses && responseData.paths) {
          this._batchResponse(responseData, hash, decoratedExecuteResolver);
        } else {
          this._eventEmitter.emit(hash, decoratedExecuteResolver(deserializeErrors(cleanPatchResponse(responseData))));
        }
      });

      const eventAsyncIterator = new EventAsyncIterator<PartialRequestResult>(this._eventEmitter, hash);
      return eventAsyncIterator.getIterator();
    }

    return new Promise((resolve: (value: PartialRawResponseData) => void, reject) => {
      this._batchRequest(
        url,
        {
          context: FetchManager._getMessageContext(context),
          request,
        },
        hash,
        { reject, resolve }
      );
    });
  }

  public log(message: string, data: PlainObject, logLevel?: LogLevel) {
    try {
      const url = this._logUrl!;
      const hash = uuidv4();

      if (!this._batchRequests) {
        void this._fetch(`${url}?requestId=${hash}`, { batched: false, data, logLevel, message });
        return;
      }

      this._batchRequest(url, { data, logLevel, message }, hash);
    } catch {
      // no catch
    }
  }

  private _batchRequest(url: string, body: PlainObject, hash: string, actions?: BatchResultActions): void {
    const activeRequestBatch = this._activeRequestBatch[url];

    if (!activeRequestBatch) {
      this._createRequestBatch(url, body, hash, actions);
    } else if (activeRequestBatch.size >= this._requestBatchMax) {
      const activeRequestBatchTimer = this._activeRequestBatchTimer[url];

      if (activeRequestBatchTimer) {
        clearTimeout(activeRequestBatchTimer);
      }

      void this._fetchBatch(url, activeRequestBatch.entries());
      this._activeRequestBatch[url] = undefined;
      this._createRequestBatch(url, body, hash, actions);
    } else {
      this._updateRequestBatch(url, body, hash, actions);
    }
  }

  private _batchResponse(response: PartialRawFetchData, hash: string, executeResolver: RequestResolver) {
    if (this._activeResponseBatchTimer) {
      this._updateResponseBatch(response, hash, executeResolver);
    } else {
      this._createResponseBatch(response, hash, executeResolver);
    }
  }

  private _createRequestBatch(url: string, body: PlainObject, hash: string, actions?: BatchResultActions): void {
    const activeRequestBatch = new Map();
    activeRequestBatch.set(hash, { actions, body });
    this._activeRequestBatch[url] = activeRequestBatch;
    this._startRequestBatchTimer(url);
  }

  private _createResponseBatch(response: PartialRawFetchData, hash: string, executeResolver: RequestResolver) {
    this._activeResponseBatch = new Set();
    this._activeResponseBatch.add(response);
    this._startResponseBatchTimer(hash, executeResolver);
  }

  private async _fetch(url: string, body: PlainObject) {
    return new Promise<PartialRawFetchData | AsyncGenerator<Response>>((resolve, reject) => {
      void (async () => {
        const fetchTimer = setTimeout(() => {
          reject(new Error(`@graphql-box/fetch-manager did not get a response within ${this._fetchTimeout}ms.`));
        }, this._fetchTimeout);

        const fetchResult = await fetch(url, {
          body: JSON.stringify(body),
          headers: new Headers(this._headers),
          method: 'POST',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        }).then(meros);

        clearTimeout(fetchTimer);

        if (isAsyncIterable(fetchResult) || fetchResult.status === 204) {
          resolve(fetchResult as Response | AsyncGenerator<Response>);
        } else {
          resolve(await parseFetchResult(fetchResult));
        }
      })();
    });
  }

  private async _fetchBatch(url: string, batchEntries: IterableIterator<[string, ActiveBatchValue]>): Promise<void> {
    const hashes: string[] = [];
    const batchActions: BatchActionsObjectMap = {};
    const batchRequests: Record<string, PlainObject> = {};

    for (const [requestHash, { actions, body }] of batchEntries) {
      hashes.push(requestHash);

      if (actions) {
        batchActions[requestHash] = actions;
      }

      batchRequests[requestHash] = body;
    }

    try {
      FetchManager._resolveFetchBatch(
        (await this._fetch(`${url}?requestId=${hashes.join('-')}`, {
          batched: true,
          requests: batchRequests,
        })) as BatchedMaybeFetchData,
        batchActions
      );
    } catch (error) {
      FetchManager._rejectBatchEntries(batchActions, error);
    }
  }

  private _startRequestBatchTimer(url: string): void {
    this._activeRequestBatchTimer[url] = setTimeout(() => {
      const activeRequestBatch = this._activeRequestBatch[url];

      if (activeRequestBatch) {
        void this._fetchBatch(url, activeRequestBatch.entries());
        this._activeRequestBatch[url] = undefined;
      }

      this._activeRequestBatchTimer[url] = undefined;
    }, this._requestBatchInterval);
  }

  private _startResponseBatchTimer(hash: string, executeResolver: RequestResolver) {
    this._activeResponseBatchTimer = setTimeout(() => {
      if (this._activeResponseBatch) {
        const responseData = mergeResponseDataSets([...this._activeResponseBatch]);
        this._eventEmitter.emit(hash, executeResolver(deserializeErrors(responseData)));
      }

      this._activeResponseBatchTimer = undefined;
    }, this._responseBatchInterval);
  }

  private _updateRequestBatch(url: string, body: PlainObject, hash: string, actions?: BatchResultActions): void {
    const activeRequestBatchTimer = this._activeRequestBatchTimer[url];

    if (activeRequestBatchTimer) {
      clearTimeout(activeRequestBatchTimer);
    }

    const activeRequestBatch = this._activeRequestBatch[url];

    if (activeRequestBatch) {
      activeRequestBatch.set(hash, { actions, body });
    }

    this._startRequestBatchTimer(url);
  }

  private _updateResponseBatch(response: PartialRawFetchData, hash: string, executeResolver: RequestResolver) {
    clearTimeout(this._activeResponseBatchTimer);

    if (this._activeResponseBatch) {
      this._activeResponseBatch.add(response);
    }

    this._startResponseBatchTimer(hash, executeResolver);
  }
}
