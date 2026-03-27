import {
  type LogLevel,
  type OperationContext,
  type OperationData,
  type OperationOptions,
  type PlainObject,
  type ResponseData,
  type SerialisedResponseData,
} from '@graphql-box/core';
import { ArgsError, InternalError, NetworkError, deserializeErrors } from '@graphql-box/helpers';
import { isError, isString } from 'lodash-es';
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
    const finalError = isError(error)
      ? error
      : new InternalError('@graphql-box/fetch-manager: Batched request failed', { cause: error });

    for (const { reject } of Object.values(batchEntries)) {
      reject(finalError);
    }
  }

  private static _resolveFetchBatch(
    { responses }: BatchedSerialisedResponseData,
    batchEntries: BatchActionsObjectMap,
  ): void {
    for (const [operationId, { reject, resolve }] of Object.entries(batchEntries)) {
      const responseData = responses[operationId];

      if (responseData) {
        resolve(logErrorsToConsole(deserializeErrors({ ...responseData })));
      } else {
        reject(
          new InternalError(`@graphql-box/fetch-manager did not get a response for batched request ${operationId}.`),
        );
      }
    }
  }

  private _activeRequestBatch: Record<string, ActiveBatch | undefined> = {};
  private _activeRequestBatchTimer: Record<string, ReturnType<typeof setTimeout> | undefined> = {};
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
      throw new AggregateError(errors, '@graphql-box/fetch-manager argument validation errors.');
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
    { operation }: OperationData,
    options: OperationOptions,
    context: OperationContext,
  ): Promise<ResponseData> {
    try {
      const url = this._apiUrl;

      if (options.batch === false || !this._batchRequests) {
        const fetchResult = await this._fetch<SerialisedResponseData>(
          `${url}?operationId=${context.data.operationId}`,
          {
            batched: false,
            context: FetchManager._getMessageContext(context),
            operation,
          },
        );

        return logErrorsToConsole(deserializeErrors(fetchResult));
      }

      return await new Promise((resolve: (value: ResponseData) => void, reject) => {
        this._batchRequest(
          url,
          {
            context: FetchManager._getMessageContext(context),
            operation,
          },
          context.data.operationId,
          { reject, resolve },
        );
      });
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new InternalError('@graphql-box/fetch-manager had an unexpected error.', { cause: error });

      return {
        errors: [confirmedError],
        extensions: { cacheMetadata: {} },
      };
    }
  }

  public log(message: string, data: PlainObject, logLevel?: LogLevel) {
    try {
      if (!this._logUrl) {
        return;
      }

      const url = this._logUrl;
      const operationId = uuid();

      if (!this._batchRequests) {
        void this._fetch(`${url}?operationId=${operationId}`, { batched: false, data, logLevel, message });
        return;
      }

      this._batchRequest(url, { data, logLevel, message }, operationId);
    } catch {
      // no catch
    }
  }

  private _batchRequest(url: string, body: PlainObject, operationId: string, actions?: BatchResultActions): void {
    const activeRequestBatch = this._activeRequestBatch[url];

    if (!activeRequestBatch) {
      this._createRequestBatch(url, body, operationId, actions);
    } else if (activeRequestBatch.size >= this._requestBatchMax) {
      const activeRequestBatchTimer = this._activeRequestBatchTimer[url];

      if (activeRequestBatchTimer) {
        clearTimeout(activeRequestBatchTimer);
      }

      void this._fetchBatch(url, activeRequestBatch.entries());
      // Okay in this instance
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this._activeRequestBatch[url];
      this._createRequestBatch(url, body, operationId, actions);
    } else {
      this._updateRequestBatch(url, body, operationId, actions);
    }
  }

  private _createRequestBatch(url: string, body: PlainObject, operationId: string, actions?: BatchResultActions): void {
    const activeRequestBatch = new Map();
    activeRequestBatch.set(operationId, { actions, body });
    this._activeRequestBatch[url] = activeRequestBatch;
    this._startRequestBatchTimer(url);
  }

  private async _fetch<T>(url: string, body: PlainObject): Promise<T> {
    const controller = new AbortController();

    const fetchTimer = setTimeout(() => {
      controller.abort();
    }, this._fetchTimeout);

    try {
      const fetchResult = await fetch(url, {
        body: JSON.stringify(body),
        headers: new Headers({
          ...this._headers,
          'x-browser-href': globalThis.location.href,
          'x-browser-pathname': globalThis.location.pathname,
        }),
        method: 'POST',
        signal: controller.signal,
      });

      if (!fetchResult.ok) {
        throw new NetworkError(
          `@graphql-box/fetch-manager received a ${String(fetchResult.status)} ${fetchResult.statusText}`,
          fetchResult.status,
          fetchResult.statusText,
        );
      }

      // .json() returns an any type
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return (await fetchResult.json()) as T;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new NetworkError(
          `@graphql-box/fetch-manager did not get a response within ${String(this._fetchTimeout)}ms.`,
        );
      }

      throw error;
    } finally {
      clearTimeout(fetchTimer);
    }
  }

  private async _fetchBatch(url: string, batchEntries: IterableIterator<[string, ActiveBatchValue]>): Promise<void> {
    const operationIds: string[] = [];
    const batchActions: BatchActionsObjectMap = {};
    const batchOperations: Record<string, PlainObject> = {};

    for (const [operationId, { actions, body }] of batchEntries) {
      operationIds.push(operationId);

      if (actions) {
        batchActions[operationId] = actions;
      }

      batchOperations[operationId] = body;
    }

    try {
      FetchManager._resolveFetchBatch(
        await this._fetch<BatchedSerialisedResponseData>(`${url}?operationId=${operationIds.join('-')}`, {
          batched: true,
          operations: batchOperations,
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
        // Okay in this instance
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this._activeRequestBatch[url];
      }

      // Okay in this instance
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this._activeRequestBatchTimer[url];
    }, this._requestBatchInterval);
  }

  private _updateRequestBatch(url: string, body: PlainObject, operationId: string, actions?: BatchResultActions): void {
    const activeRequestBatchTimer = this._activeRequestBatchTimer[url];

    if (activeRequestBatchTimer) {
      clearTimeout(activeRequestBatchTimer);
    }

    const activeRequestBatch = this._activeRequestBatch[url];

    if (activeRequestBatch) {
      activeRequestBatch.set(operationId, { actions, body });
    }

    this._startRequestBatchTimer(url);
  }
}
