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
import { meros } from 'meros/browser';
import { v4 as uuid } from 'uuid';
import { logFetch } from './debug/logFetch.ts';
import { cleanPatchResponse } from './helpers/cleanPatchResponse.ts';
import { logErrorsToConsole } from './helpers/logErrorsToConsole.ts';
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
  private static _getMessageContext({ initiator, operation, originalRequestHash, requestID }: RequestContext) {
    return { initiator, operation, originalRequestHash, requestID };
  }

  private static _rejectBatchEntries(batchEntries: BatchActionsObjectMap, error: unknown): void {
    for (const { reject } of Object.values(batchEntries)) {
      reject(error);
    }
  }

  private static _resolveFetchBatch(
    { headers, responses }: BatchedMaybeFetchData,
    batchEntries: BatchActionsObjectMap,
  ): void {
    for (const [hash, { reject, resolve }] of Object.entries(batchEntries)) {
      const responseData = responses[hash];

      if (responseData) {
        resolve(logErrorsToConsole(deserializeErrors({ headers, ...responseData })));
      } else {
        reject(new Error(`@graphql-box/fetch-manager did not get a response for batched request ${hash}.`));
      }
    }
  }

  private _activeRequestBatch: Record<string, ActiveBatch | undefined> = {};
  private _activeRequestBatchTimer: Record<string, NodeJS.Timeout | undefined> = {};
  private _activeResponseBatch: Set<PartialRawFetchData> | undefined;
  private _activeResponseBatchTimer: NodeJS.Timeout | undefined;
  private readonly _apiUrl: string;
  private readonly _batchRequests: boolean;
  private readonly _batchResponses: boolean;
  private readonly _eventEmitter: EventEmitter;
  private readonly _fetchTimeout: number;
  private readonly _headers: Record<string, string> = { 'content-type': 'application/json' };
  private readonly _logUrl: string | undefined;
  private readonly _requestBatchInterval: number;
  private readonly _requestBatchMax: number;
  private readonly _responseBatchInterval: number;

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
    executeResolver: RequestResolver,
  ) {
    const url = this._apiUrl;

    if (options.batch === false || !this._batchRequests || context.hasDeferOrStream) {
      const fetchResult = await this._fetch(`${url}?requestId=${hash}`, {
        batched: false,
        context: FetchManager._getMessageContext(context),
        request,
      });

      const { debugManager, ...otherContext } = context;

      if (!isAsyncIterable(fetchResult)) {
        return logErrorsToConsole(deserializeErrors(fetchResult));
      }

      void forAwaitEach(fetchResult, async ({ body, headers }) => {
        // Struggling to cleanly type this another way
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const responseData = { headers, ...body } as unknown as PartialRawFetchData;

        const decoratedExecuteResolver = (result: PartialRawResponseData) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          this._eventEmitter.emit(
            hash,
            await decoratedExecuteResolver(logErrorsToConsole(deserializeErrors(cleanPatchResponse(responseData)))),
          );
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
        { reject, resolve },
      );
    });
  }

  public log(message: string, data: PlainObject, logLevel?: LogLevel) {
    try {
      if (!this._logUrl) {
        return;
      }

      const url = this._logUrl;
      const hash = uuid();

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
          reject(
            new Error(`@graphql-box/fetch-manager did not get a response within ${String(this._fetchTimeout)}ms.`),
          );
        }, this._fetchTimeout);

        const fetchResult = await fetch(url, {
          body: JSON.stringify(body),
          headers: new Headers({
            ...this._headers,
            'x-browser-href': globalThis.location.href,
            'x-browser-pathname': globalThis.location.pathname,
          }),
          method: 'POST',
        }).then(meros);

        clearTimeout(fetchTimer);

        if (isAsyncIterable(fetchResult) || fetchResult.status === 204) {
          resolve(fetchResult);
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
        // Casting most straight forward way of typing this for now.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        (await this._fetch(`${url}?requestId=${hashes.join('-')}`, {
          batched: true,
          requests: batchRequests,
        })) as BatchedMaybeFetchData,
        batchActions,
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
      void (async () => {
        if (this._activeResponseBatch) {
          const responseData = mergeResponseDataSets([...this._activeResponseBatch]);
          this._eventEmitter.emit(hash, await executeResolver(logErrorsToConsole(deserializeErrors(responseData))));
        }

        this._activeResponseBatchTimer = undefined;
      })();
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
