import {
  FETCH_RESOLVED,
  MaybeRawFetchData,
  MaybeRawResponseData,
  MaybeRequestResult,
  PlainObjectStringMap,
  RequestContext,
  RequestData,
  RequestManagerDef,
  RequestManagerInit,
  RequestOptions,
  RequestResolver,
} from "@graphql-box/core";
import { EventAsyncIterator, deserializeErrors } from "@graphql-box/helpers";
import EventEmitter from "eventemitter3";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { isPlainObject, isString } from "lodash";
import { meros } from "meros/browser";
import logFetch from "../debug/log-fetch";
import {
  ActiveBatch,
  ActiveBatchValue,
  BatchActionsObjectMap,
  BatchResultActions,
  BatchedMaybeFetchData,
  ConstructorOptions,
  FetchOptions,
  UserOptions,
} from "../defs";
import cleanPatchResponse from "../helpers/cleanPatchResponse";
import mergeResponseDataSets from "../helpers/mergeResponseDataSets";
import parseFetchResult from "../helpers/parseFetchResult";

export class FetchManager implements RequestManagerDef {
  private static _getMessageContext({ operation, requestID, whitelistHash }: RequestContext, batch: boolean) {
    return batch ? { operation, requestID } : { operation, requestID, whitelistHash };
  }

  private static _rejectBatchEntries(batchEntries: BatchActionsObjectMap, error: any): void {
    Object.keys(batchEntries).forEach(hash => {
      const { reject } = batchEntries[hash];
      reject(error);
    });
  }

  private static _resolveFetchBatch(
    { batch, headers }: BatchedMaybeFetchData,
    batchEntries: BatchActionsObjectMap,
  ): void {
    Object.keys(batchEntries).forEach(hash => {
      const responseData = batch[hash];
      const { reject, resolve } = batchEntries[hash];

      if (responseData) {
        resolve(deserializeErrors({ headers, ...responseData }));
      } else {
        reject(new Error(`@graphql-box/fetch-manager did not get a response for batched request ${hash}.`));
      }
    });
  }

  private _activeRequestBatch: ActiveBatch | undefined;
  private _activeRequestBatchTimer: NodeJS.Timer | undefined;
  private _activeResponseBatch: Set<MaybeRawFetchData> | undefined;
  private _activeResponseBatchTimer: NodeJS.Timer | undefined;
  private _batchRequests: boolean;
  private _batchResponses: boolean;
  private _eventEmitter: EventEmitter;
  private _fetchTimeout: number;
  private _headers: PlainObjectStringMap = { "content-type": "application/json" };
  private _requestBatchInterval: number;
  private _responseBatchInterval: number;
  private _url: string;

  constructor(options: ConstructorOptions) {
    const errors: TypeError[] = [];

    if (!isString(options.url)) {
      errors.push(new TypeError("@graphql-box/fetch-manager expected url to be a string."));
    }

    if (errors.length) {
      throw errors;
    }

    this._batchRequests = options.batchRequests ?? false;
    this._batchResponses = options.batchResponses ?? true;
    this._requestBatchInterval = options.requestBatchInterval ?? 100;
    this._responseBatchInterval = options.responseBatchInterval ?? 100;
    this._eventEmitter = new EventEmitter();
    this._fetchTimeout = options.fetchTimeout ?? 5000;
    this._headers = { ...this._headers, ...(options.headers ?? {}) };
    this._url = options.url;
  }

  @logFetch()
  public async execute(
    { hash, request }: RequestData,
    options: RequestOptions,
    context: RequestContext,
    executeResolver: RequestResolver,
  ) {
    try {
      if (options.batch === false || !this._batchRequests || context.hasDeferOrStream) {
        const fetchResult = await this._fetch(request, hash, { batch: false }, context);
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
        this._batchRequest(request, hash, { resolve, reject }, context);
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _batchRequest(request: string, hash: string, actions: BatchResultActions, context: RequestContext): void {
    if (this._activeRequestBatchTimer) {
      this._updateRequestBatch(request, hash, actions, context);
    } else {
      this._createRequestBatch(request, hash, actions, context);
    }
  }

  private _batchResponse(response: MaybeRawFetchData, hash: string, executeResolver: RequestResolver) {
    if (this._activeResponseBatchTimer) {
      this._updateResponseBatch(response, hash, executeResolver);
    } else {
      this._createResponseBatch(response, hash, executeResolver);
    }
  }

  private _createRequestBatch(
    request: string,
    hash: string,
    actions: BatchResultActions,
    context: RequestContext,
  ): void {
    this._activeRequestBatch = new Map();
    this._activeRequestBatch.set(hash, { actions, request, whitelistHash: context.whitelistHash });
    this._startRequestBatchTimer(context);
  }

  private _createResponseBatch(response: MaybeRawFetchData, hash: string, executeResolver: RequestResolver) {
    this._activeResponseBatch = new Set();
    this._activeResponseBatch.add(response);
    this._startResponseBatchTimer(hash, executeResolver);
  }

  private async _fetch(
    request: string | Record<string, { request: string; whitelistHash: string }>,
    hash: string,
    { batch }: FetchOptions,
    context: RequestContext,
  ) {
    try {
      return new Promise(async (resolve: (value: MaybeRawFetchData | AsyncGenerator<Response>) => void, reject) => {
        const fetchTimer = setTimeout(() => {
          reject(new Error(`@graphql-box/fetch-manager did not get a response within ${this._fetchTimeout}ms.`));
        }, this._fetchTimeout);

        const url = `${this._url}?requestId=${hash}`;

        const fetchResult = await fetch(url, {
          body: JSON.stringify({
            batched: batch,
            context: FetchManager._getMessageContext(context, batch),
            request,
          }),
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

  private async _fetchBatch(
    batchEntries: IterableIterator<[string, ActiveBatchValue]>,
    context: RequestContext,
  ): Promise<void> {
    const hashes: string[] = [];
    const batchActions: BatchActionsObjectMap = {};
    const batchRequests: Record<string, { request: string; whitelistHash: string }> = {};

    for (const [requestHash, { actions, request, whitelistHash }] of batchEntries) {
      hashes.push(requestHash);
      batchActions[requestHash] = actions;

      batchRequests[requestHash] = {
        request,
        whitelistHash,
      };
    }

    try {
      FetchManager._resolveFetchBatch(
        (await this._fetch(batchRequests, hashes.join("-"), { batch: true }, context)) as BatchedMaybeFetchData,
        batchActions,
      );
    } catch (error) {
      FetchManager._rejectBatchEntries(batchActions, error);
    }
  }

  private _startRequestBatchTimer(context: RequestContext): void {
    this._activeRequestBatchTimer = setTimeout(() => {
      if (this._activeRequestBatch) {
        this._fetchBatch(this._activeRequestBatch.entries(), context);
      }

      this._activeRequestBatchTimer = undefined;
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

  private _updateRequestBatch(
    request: string,
    requestHash: string,
    actions: BatchResultActions,
    context: RequestContext,
  ): void {
    clearTimeout(this._activeRequestBatchTimer as NodeJS.Timer);

    if (this._activeRequestBatch) {
      this._activeRequestBatch.set(requestHash, { actions, request, whitelistHash: context.whitelistHash });
    }

    this._startRequestBatchTimer(context);
  }

  private _updateResponseBatch(response: MaybeRawFetchData, hash: string, executeResolver: RequestResolver) {
    clearTimeout(this._activeResponseBatchTimer as NodeJS.Timer);

    if (this._activeResponseBatch) {
      this._activeResponseBatch.add(response);
    }

    this._startResponseBatchTimer(hash, executeResolver);
  }
}

export default function init(userOptions: UserOptions): RequestManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@graphql-box/fetch-manager expected userOptions to be a plain object.");
  }

  return () => new FetchManager(userOptions);
}
