import {
  FETCH_RESOLVED,
  LogLevel,
  MaybeRawFetchData,
  MaybeRawResponseData,
  MaybeRequestResult,
  PlainObjectMap,
  PlainObjectStringMap,
  RequestContext,
  RequestData,
  RequestOptions,
  RequestResolver,
} from "@graphql-box/core";
import { EventAsyncIterator, deserializeErrors } from "@graphql-box/helpers";
import EventEmitter from "eventemitter3";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { isString } from "lodash";
import { meros } from "meros/browser";
import { JsonValue } from "type-fest";
import { v1 as uuid } from "uuid";
import logFetch from "../debug/log-fetch";
import {
  ActiveBatch,
  ActiveBatchValue,
  BatchActionsObjectMap,
  BatchResultActions,
  BatchedMaybeFetchData,
  UserOptions,
} from "../defs";
import cleanPatchResponse from "../helpers/cleanPatchResponse";
import mergeResponseDataSets from "../helpers/mergeResponseDataSets";
import parseFetchResult from "../helpers/parseFetchResult";

export default class FetchManager {
  private static _getMessageContext({ operation, requestID, whitelistHash }: RequestContext) {
    return { operation, requestID, whitelistHash };
  }

  private static _rejectBatchEntries(batchEntries: BatchActionsObjectMap, error: any): void {
    Object.keys(batchEntries).forEach(hash => {
      const { reject } = batchEntries[hash];
      reject(error);
    });
  }

  private static _resolveFetchBatch(
    { headers, responses }: BatchedMaybeFetchData,
    batchEntries: BatchActionsObjectMap,
  ): void {
    Object.keys(batchEntries).forEach(hash => {
      const responseData = responses[hash];
      const { reject, resolve } = batchEntries[hash];

      if (responseData) {
        resolve(deserializeErrors({ headers, ...responseData }));
      } else {
        reject(new Error(`@graphql-box/fetch-manager did not get a response for batched request ${hash}.`));
      }
    });
  }

  private _activeRequestBatch: Record<string, ActiveBatch> = {};
  private _activeRequestBatchTimer: Record<string, NodeJS.Timer> = {};
  private _activeResponseBatch: Set<MaybeRawFetchData> | undefined;
  private _activeResponseBatchTimer: NodeJS.Timer | undefined;
  private _apiUrl: string | undefined;
  private _batchRequests: boolean;
  private _batchResponses: boolean;
  private _eventEmitter: EventEmitter;
  private _fetchTimeout: number;
  private _headers: PlainObjectStringMap = { "content-type": "application/json" };
  private _logUrl: string | undefined;
  private _requestBatchInterval: number;
  private _responseBatchInterval: number;

  constructor(options: UserOptions) {
    const errors: TypeError[] = [];

    if (!isString(options.apiUrl) && !isString(options.logUrl)) {
      errors.push(new TypeError("@graphql-box/fetch-manager expected apiUrl or logUrl to be a string."));
    }

    if (errors.length) {
      throw errors;
    }

    this._apiUrl = options.apiUrl;
    this._batchRequests = options.batchRequests ?? false;
    this._batchResponses = options.batchResponses ?? true;
    this._eventEmitter = new EventEmitter();
    this._fetchTimeout = options.fetchTimeout ?? 5000;
    this._headers = { ...this._headers, ...(options.headers ?? {}) };
    this._logUrl = options.logUrl;
    this._requestBatchInterval = options.requestBatchInterval ?? 100;
    this._responseBatchInterval = options.responseBatchInterval ?? 100;
  }

  @logFetch()
  public async execute(
    { hash, request }: RequestData,
    options: RequestOptions,
    context: RequestContext,
    executeResolver: RequestResolver,
  ) {
    try {
      const url = this._apiUrl as string;

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

        forAwaitEach(fetchResult, async ({ body, headers }) => {
          const responseData = ({ headers, ...body } as unknown) as MaybeRawFetchData;

          const decoratedExecuteResolver = (result: MaybeRawResponseData) => {
            const { headers: resultHeaders, ...otherResult } = result;

            debugManager?.log(FETCH_RESOLVED, {
              context: otherContext,
              options,
              requestHash: hash,
              result: otherResult,
              stats: { endTime: debugManager?.now() },
            });

            return executeResolver(result);
          };

          if (this._batchResponses && responseData.paths) {
            this._batchResponse(responseData, hash, decoratedExecuteResolver);
          } else {
            this._eventEmitter.emit(
              hash,
              await decoratedExecuteResolver(deserializeErrors(cleanPatchResponse(responseData))),
            );
          }
        });

        const eventAsyncIterator = new EventAsyncIterator<MaybeRequestResult>(this._eventEmitter, hash);
        return eventAsyncIterator.getIterator();
      }

      return new Promise((resolve: (value: MaybeRawResponseData) => void, reject) => {
        this._batchRequest(
          url,
          {
            context: FetchManager._getMessageContext(context),
            request,
          },
          hash,
          { resolve, reject },
        );
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public log(message: string, data: PlainObjectMap, logLevel?: LogLevel) {
    try {
      const url = this._logUrl as string;
      const hash = uuid();

      if (!this._batchRequests) {
        this._fetch(`${url}?requestId=${hash}`, { batched: false, message, data, logLevel });
        return;
      }

      this._batchRequest(url, { message, data, logLevel }, hash);
    } catch {
      // no catch
    }
  }

  private _batchRequest(url: string, body: JsonValue, hash: string, actions?: BatchResultActions): void {
    if (this._activeRequestBatchTimer[url]) {
      this._updateRequestBatch(url, body, hash, actions);
    } else {
      this._createRequestBatch(url, body, hash, actions);
    }
  }

  private _batchResponse(response: MaybeRawFetchData, hash: string, executeResolver: RequestResolver) {
    if (this._activeResponseBatchTimer) {
      this._updateResponseBatch(response, hash, executeResolver);
    } else {
      this._createResponseBatch(response, hash, executeResolver);
    }
  }

  private _createRequestBatch(url: string, body: JsonValue, hash: string, actions?: BatchResultActions): void {
    this._activeRequestBatch[url] = new Map();
    this._activeRequestBatch[url].set(hash, { actions, body });
    this._startRequestBatchTimer(url);
  }

  private _createResponseBatch(response: MaybeRawFetchData, hash: string, executeResolver: RequestResolver) {
    this._activeResponseBatch = new Set();
    this._activeResponseBatch.add(response);
    this._startResponseBatchTimer(hash, executeResolver);
  }

  private async _fetch(url: string, body: JsonValue) {
    try {
      return new Promise(async (resolve: (value: MaybeRawFetchData | AsyncGenerator<Response>) => void, reject) => {
        const fetchTimer = setTimeout(() => {
          reject(new Error(`@graphql-box/fetch-manager did not get a response within ${this._fetchTimeout}ms.`));
        }, this._fetchTimeout);

        const fetchResult = await fetch(url, {
          body: JSON.stringify(body),
          headers: new Headers(this._headers),
          method: "POST",
        }).then(meros);

        clearTimeout(fetchTimer);
        resolve(isAsyncIterable(fetchResult) ? fetchResult : await parseFetchResult(fetchResult));
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _fetchBatch(url: string, batchEntries: IterableIterator<[string, ActiveBatchValue]>): Promise<void> {
    const hashes: string[] = [];
    const batchActions: BatchActionsObjectMap = {};
    const batchRequests: Record<string, JsonValue> = {};

    for (const [requestHash, { actions, body }] of batchEntries) {
      hashes.push(requestHash);

      if (actions) {
        batchActions[requestHash] = actions;
      }

      batchRequests[requestHash] = body;
    }

    try {
      FetchManager._resolveFetchBatch(
        (await this._fetch(`${url}?requestId=${hashes.join("-")}`, {
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
      if (this._activeRequestBatch[url]) {
        this._fetchBatch(url, this._activeRequestBatch[url].entries());
        delete this._activeRequestBatch[url];
      }

      delete this._activeRequestBatchTimer[url];
    }, this._requestBatchInterval);
  }

  private _startResponseBatchTimer(hash: string, executeResolver: RequestResolver) {
    this._activeResponseBatchTimer = setTimeout(async () => {
      if (this._activeResponseBatch) {
        const responseData = mergeResponseDataSets(Array.from(this._activeResponseBatch));
        this._eventEmitter.emit(hash, await executeResolver(deserializeErrors(responseData)));
      }

      this._activeResponseBatchTimer = undefined;
    }, this._responseBatchInterval);
  }

  private _updateRequestBatch(url: string, body: JsonValue, hash: string, actions?: BatchResultActions): void {
    clearTimeout(this._activeRequestBatchTimer[url]);

    if (this._activeRequestBatch[url]) {
      this._activeRequestBatch[url].set(hash, { actions, body });
    }

    this._startRequestBatchTimer(url);
  }

  private _updateResponseBatch(response: MaybeRawFetchData, hash: string, executeResolver: RequestResolver) {
    clearTimeout(this._activeResponseBatchTimer as NodeJS.Timer);

    if (this._activeResponseBatch) {
      this._activeResponseBatch.add(response);
    }

    this._startResponseBatchTimer(hash, executeResolver);
  }
}
