import { MaybeRawResponseData, PlainObjectStringMap, RequestDataWithMaybeAST } from "@handl/core";
import { isPlainObject, isString } from "lodash";
import {
  ActiveBatch,
  ActiveBatchValue,
  BatchActionsObjectMap,
  BatchedMaybeFetchData,
  BatchResultActions,
  ConstructorOptions,
  FetchOptions,
  InitOptions,
  RequestManagerDef,
  RequestManagerInit,
  UserOptions,
} from "../defs";

export class RequestManager implements RequestManagerDef {
  public static async init(options: InitOptions): Promise<RequestManager> {
    const errors: TypeError[] = [];

    if (!isString(options.url)) {
       errors.push(new TypeError("@handl/request-manager expected url to be a string."));
    }

    if (errors.length) return Promise.reject(errors);

    try {
      return new RequestManager(options);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private static _rejectBatchEntries(batchEntries: BatchActionsObjectMap, error: any): void {
    Object.keys(batchEntries).forEach((hash) => {
      const { reject } = batchEntries[hash];
      reject(error);
    });
  }

  private static _resolveFetchBatch(
    { batch, headers }: BatchedMaybeFetchData,
    batchEntries: BatchActionsObjectMap,
  ): void {
    Object.keys(batchEntries).forEach((hash) => {
      const responseData = batch[hash];
      const { reject, resolve } = batchEntries[hash];

      if (responseData) {
        resolve({ headers, ...responseData });
      } else {
        reject(new Error(`@handl/request-manager did not get a response for batched request ${hash}.`));
      }
    });
  }

  private _activeBatch: ActiveBatch | undefined;
  private _activeBatchTimer: NodeJS.Timer | undefined;
  private _batch: boolean;
  private _batchInterval: number;
  private _fetchTimeout: number;
  private _headers: PlainObjectStringMap = { "content-type": "application/json" };
  private _url: string;

  constructor(options: ConstructorOptions) {
    const { batch, batchInterval, fetchTimeout, headers = {}, url } = options;
    this._batch = batch || false;
    this._batchInterval = batchInterval || 100;
    this._fetchTimeout = fetchTimeout || 5000;
    this._headers = { ...this._headers, ...headers };
    this._url = url;
  }

  public async fetch({ hash, request }: RequestDataWithMaybeAST): Promise<MaybeRawResponseData> {
    try {
      if (!this._batch) return await this._fetch(request, hash, { batch: false });

      return new Promise((resolve: (value: MaybeRawResponseData) => void, reject) => {
        this._batchRequest(request, hash, { resolve, reject });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _batchRequest(request: string, hash: string, actions: BatchResultActions) {
    if (this._activeBatchTimer) {
      this._updateBatch(request, hash, actions);
    } else {
      this._createBatch(request, hash, actions);
    }
  }

  private _createBatch(request: string, hash: string, actions: BatchResultActions) {
    this._activeBatch = new Map();
    this._activeBatch.set(hash, { actions, request });
    this._startBatchTimer();
  }

  private async _fetch(
    request: string | PlainObjectStringMap,
    hash: string,
    { batch }: FetchOptions,
  ): Promise<MaybeRawResponseData | BatchedMaybeFetchData> {
    try {
      return new Promise(async (resolve: (value: MaybeRawResponseData) => void, reject) => {
        const fetchTimer = setTimeout(() => {
          reject(new Error(`@handl/request-manager did not get a response within ${this._fetchTimeout}ms.`));
        }, this._fetchTimeout);

        const url = `${this._url}?requestId=${hash}`;

        const fetchResult = await fetch(url, {
          body: JSON.stringify({ batched: batch, request }),
          headers: new Headers(this._headers),
          method: "POST",
        });

        clearTimeout(fetchTimer);

        resolve({
          headers: fetchResult.headers,
          ...await fetchResult.json(),
        });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _fetchBatch(batchEntries: IterableIterator<[string, ActiveBatchValue]>) {
    const hashes: string[] = [];
    const batchActions: BatchActionsObjectMap = {};
    const batchRequests: PlainObjectStringMap = {};

    for (const [requestHash, { actions, request }] of batchEntries) {
      hashes.push(requestHash);
      batchActions[requestHash] = actions;
      batchRequests[requestHash] = request;
    }

    try {
      RequestManager._resolveFetchBatch(
        await this._fetch(batchRequests, hashes.join("-"), { batch: true }) as BatchedMaybeFetchData,
        batchActions,
      );
    } catch (error) {
      RequestManager._rejectBatchEntries(batchActions, error);
    }
  }

  private _startBatchTimer() {
    this._activeBatchTimer = setTimeout(() => {
      if (this._activeBatch) {
        this._fetchBatch(this._activeBatch.entries());
      }

      this._activeBatchTimer = undefined;
    }, this._batchInterval);
  }

  private _updateBatch(request: string, requestHash: string, actions: BatchResultActions) {
    clearTimeout(this._activeBatchTimer as NodeJS.Timer);

    if (this._activeBatch) {
      this._activeBatch.set(requestHash, { actions, request });
    }

    this._startBatchTimer();
  }
}

export default function init(userOptions: UserOptions): RequestManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@handl/request-manager expected userOptions to be a plain object.");
  }

  return () => RequestManager.init(userOptions);
}
