import {
  MaybeRawResponseData,
  MaybeRequestContext,
  MaybeRequestResult,
  PlainObjectStringMap,
  RequestContext,
  RequestDataWithMaybeAST,
  RequestManagerDef,
  RequestManagerInit,
  RequestOptions,
  RequestResolver,
} from "@graphql-box/core";
import { EventAsyncIterator } from "@graphql-box/helpers";
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
  InitOptions,
  UserOptions,
} from "../defs";
import cleanPatchResponse from "../helpers/cleanPatchResponse";
import parseFetchResult from "../helpers/parseFetchResult";

export class FetchManager implements RequestManagerDef {
  public static async init(options: InitOptions): Promise<FetchManager> {
    const errors: TypeError[] = [];

    if (!isString(options.url)) {
      errors.push(new TypeError("@graphql-box/fetch-manager expected url to be a string."));
    }

    if (errors.length) return Promise.reject(errors);

    return new FetchManager(options);
  }

  private static _getMessageContext({ boxID, operation }: RequestContext): MaybeRequestContext {
    return { boxID, operation };
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
        resolve({ headers, ...responseData });
      } else {
        reject(new Error(`@graphql-box/fetch-manager did not get a response for batched request ${hash}.`));
      }
    });
  }

  private _activeBatch: ActiveBatch | undefined;
  private _activeBatchTimer: NodeJS.Timer | undefined;
  private _batch: boolean;
  private _batchInterval: number;
  private _eventEmitter: EventEmitter;
  private _fetchTimeout: number;
  private _headers: PlainObjectStringMap = { "content-type": "application/json" };
  private _url: string;

  constructor(options: ConstructorOptions) {
    const { batch, batchInterval, fetchTimeout, headers = {}, url } = options;
    this._batch = batch || false;
    this._batchInterval = batchInterval || 100;
    this._eventEmitter = new EventEmitter();
    this._fetchTimeout = fetchTimeout || 5000;
    this._headers = { ...this._headers, ...headers };
    this._url = url;
  }

  @logFetch()
  public async execute(
    { hash, request }: RequestDataWithMaybeAST,
    _options: RequestOptions,
    context: RequestContext,
    executeResolver: RequestResolver,
  ) {
    try {
      if (!this._batch || context.hasDeferOrStream) {
        const fetchResult = await this._fetch(request, hash, { batch: false }, context);

        if (!isAsyncIterable(fetchResult)) {
          return fetchResult;
        }

        forAwaitEach(fetchResult, async ({ body, headers }) => {
          const responseData = { headers, ...body };

          this._eventEmitter.emit(
            hash,
            await executeResolver(cleanPatchResponse(responseData as MaybeRawResponseData)),
          );
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
    if (this._activeBatchTimer) {
      this._updateBatch(request, hash, actions, context);
    } else {
      this._createBatch(request, hash, actions, context);
    }
  }

  private _createBatch(request: string, hash: string, actions: BatchResultActions, context: RequestContext): void {
    this._activeBatch = new Map();
    this._activeBatch.set(hash, { actions, request });
    this._startBatchTimer(context);
  }

  private async _fetch(
    request: string | PlainObjectStringMap,
    hash: string,
    { batch }: FetchOptions,
    context: RequestContext,
  ) {
    try {
      return new Promise(async (resolve: (value: MaybeRawResponseData | AsyncGenerator<Response>) => void, reject) => {
        const fetchTimer = setTimeout(() => {
          reject(new Error(`@graphql-box/fetch-manager did not get a response within ${this._fetchTimeout}ms.`));
        }, this._fetchTimeout);

        const url = `${this._url}?requestId=${hash}`;

        const fetchResult = await fetch(url, {
          body: JSON.stringify({
            batched: batch,
            context: FetchManager._getMessageContext(context),
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
    const batchRequests: PlainObjectStringMap = {};

    for (const [requestHash, { actions, request }] of batchEntries) {
      hashes.push(requestHash);
      batchActions[requestHash] = actions;
      batchRequests[requestHash] = request;
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

  private _startBatchTimer(context: RequestContext): void {
    this._activeBatchTimer = setTimeout(() => {
      if (this._activeBatch) {
        this._fetchBatch(this._activeBatch.entries(), context);
      }

      this._activeBatchTimer = undefined;
    }, this._batchInterval);
  }

  private _updateBatch(
    request: string,
    requestHash: string,
    actions: BatchResultActions,
    context: RequestContext,
  ): void {
    clearTimeout(this._activeBatchTimer as NodeJS.Timer);

    if (this._activeBatch) {
      this._activeBatch.set(requestHash, { actions, request });
    }

    this._startBatchTimer(context);
  }
}

export default function init(userOptions: UserOptions): RequestManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@graphql-box/fetch-manager expected userOptions to be a plain object.");
  }

  return () => FetchManager.init(userOptions);
}
