import {
  type LogLevel,
  type OperationContext,
  type OperationData,
  type OperationOptions,
  type PlainObject,
  type ResponseData,
  type SerialisedResponseData,
} from '@graphql-box/core';
import { ArgsError, GroupedError, deserializeErrors } from '@graphql-box/helpers';
import { isString } from 'lodash-es';
import { v4 as uuid } from 'uuid';
import { logFetch } from './debug/logFetch.ts';
import { logErrorsToConsole } from './helpers/logErrorsToConsole.ts';
import {
  type ActiveBatch,
  type ActiveBatchValue,
  type BatchActionsObjectMap,
  type BatchResultActions,
  type BatchedSerialisedResponseData,
  type UserOptions,
} from './types.ts';

export class FetchManager {
  private static _getMessageContext({ data }: OperationContext) {
    return { data };
  }

  private static _rejectBatchEntries(batchEntries: BatchActionsObjectMap, error: unknown): void {
    for (const { reject } of Object.values(batchEntries)) {
      reject(error);
    }
  }

  private static _resolveFetchBatch(
    { responses }: BatchedSerialisedResponseData,
    batchEntries: BatchActionsObjectMap,
  ): void {
    for (const [hash, { reject, resolve }] of Object.entries(batchEntries)) {
      const responseData = responses[hash];

      if (responseData) {
        resolve(logErrorsToConsole(deserializeErrors({ ...responseData })));
      } else {
        reject(new Error(`@graphql-box/fetch-manager did not get a response for batched request ${hash}.`));
      }
    }
  }

  private _activeRequestBatch: Record<string, ActiveBatch | undefined> = {};
  private _activeRequestBatchTimer: Record<string, NodeJS.Timeout | undefined> = {};
  private readonly _apiUrl: string;
  private readonly _batchRequests: boolean;
  private readonly _fetchTimeout: number;
  private readonly _headers: Record<string, string> = { 'content-type': 'application/json' };
  private readonly _logUrl: string | undefined;
  private readonly _requestBatchInterval: number;
  private readonly _requestBatchMax: number;

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
    this._fetchTimeout = options.fetchTimeout ?? 5000;
    this._headers = { ...this._headers, ...options.headers };
    this._logUrl = options.logUrl;
    this._requestBatchInterval = options.requestBatchInterval ?? 100;
    this._requestBatchMax = options.requestBatchMax ?? 20;
  }

  @logFetch()
  public async execute(
    { hash, operation }: OperationData,
    options: OperationOptions,
    context: OperationContext,
  ): Promise<ResponseData> {
    const url = this._apiUrl;

    if (options.batch === false || !this._batchRequests) {
      const fetchResult = await this._fetch<SerialisedResponseData>(`${url}?requestId=${hash}`, {
        batched: false,
        context: FetchManager._getMessageContext(context),
        operation,
      });

      return logErrorsToConsole(deserializeErrors(fetchResult));
    }

    return new Promise((resolve: (value: ResponseData) => void, reject) => {
      this._batchRequest(
        url,
        {
          context: FetchManager._getMessageContext(context),
          operation,
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

  private _createRequestBatch(url: string, body: PlainObject, hash: string, actions?: BatchResultActions): void {
    const activeRequestBatch = new Map();
    activeRequestBatch.set(hash, { actions, body });
    this._activeRequestBatch[url] = activeRequestBatch;
    this._startRequestBatchTimer(url);
  }

  private async _fetch<T>(url: string, body: PlainObject): Promise<T> {
    return new Promise<T>((resolve, reject) => {
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
        });

        clearTimeout(fetchTimer);
        // .json() returns an any type
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        resolve((await fetchResult.json()) as T);
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
        await this._fetch<BatchedSerialisedResponseData>(`${url}?requestId=${hashes.join('-')}`, {
          batched: true,
          requests: batchRequests,
        }),
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
}
