import { isArray, isBoolean, isPlainObject } from "lodash";

import {
  ActiveBatch,
  ActiveBatchValue,
  BatchResultActions,
  FetchManagerFetchResult,
  FetchManagerResolveResult,
} from "./types";

import hashRequest from "../helpers/hash-request";
import { FetchManagerArgs, ObjectMap, ObjectStringMap } from "../types";

export default class FetchManager {
  private static _rejectBatchEntries(batchEntries: IterableIterator<[string, ActiveBatchValue]>, error: any): void {
    for (const [, { actions: { reject } }] of batchEntries) {
      reject(error);
    }
  }

  private static _resolveFetch({ headers, result }: FetchManagerFetchResult): FetchManagerResolveResult {
    let errors: Error | Error[];

    if (!isPlainObject(result)) {
      errors = new TypeError("Fetch expected the result to be a JSON object.");
      return { errors };
    }

    if (result.errors instanceof Error || (isArray(result.errors) && result.errors[0] instanceof Error)) {
      return { errors: result.errors };
    }

    return {
      cacheMetadata: result.cacheMetadata,
      data: result.data,
      headers,
    };
  }

  private static _resolveFetchBatch(
    { headers, result }: FetchManagerFetchResult,
    batchEntries: IterableIterator<[string, ActiveBatchValue]>,
  ): void {
    if (!isPlainObject(result)) {
      const typeError = new TypeError("ResolveFetchBatch expected result to be a plain object.");
      FetchManager._rejectBatchEntries(batchEntries, typeError);
      return;
    }

    const error = new Error("FetchManager did not receive a response for the request.");

    for (const [requestHash, { actions: { reject, resolve } }] of batchEntries) {
      const res = result[requestHash];

      if (!res) {
        reject(error);
        return;
      }

      resolve(FetchManager._resolveFetch({ headers, result: res }));
    }
  }

  private _activeBatch: ActiveBatch;
  private _activeBatchID: NodeJS.Timer | undefined;
  private _batch: boolean = false;
  private _headers: ObjectMap = { "content-type": "application/json" };
  private _url: string;

  constructor({ batch, headers, url }: FetchManagerArgs) {
    if (isBoolean(batch)) this._batch = batch;
    if (headers && isPlainObject(headers)) this._headers = { ...this._headers, ...headers };
    this._url = url;
  }

  public async resolve(request: string): Promise<FetchManagerResolveResult> {
    try {
      const requestHash = hashRequest(request);
      if (!this._batch) return FetchManager._resolveFetch(await this._fetch(request, requestHash));

      return new Promise((resolve: (value: FetchManagerResolveResult) => void, reject) => {
        this._batchRequest(request, requestHash, { resolve, reject });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _batchRequest(request: string, requestHash: string, actions: BatchResultActions) {
    if (this._activeBatchID) {
      this._updateBatch(request, requestHash, actions);
    } else {
      this._createBatch(request, requestHash, actions);
    }
  }

  private _createBatch(request: string, requestHash: string, actions: BatchResultActions) {
    this._activeBatch = new Map();
    this._activeBatch.set(requestHash, { actions, request });

    this._activeBatchID = setTimeout(() => {
      this._fetchBatch(this._activeBatch.entries());
      this._activeBatchID = undefined;
    }, 0);
  }

  private async _fetch(request: string | ObjectStringMap, requestHash: string): Promise<FetchManagerFetchResult> {
    try {
      const url = `${this._url}?requestId=${requestHash}`;

      const fetchResult = await fetch(url, {
        body: JSON.stringify({ batch: this._batch, query: request }),
        headers: new Headers(this._headers),
        method: "POST",
      });

      return {
        headers: fetchResult.headers,
        result: await fetchResult.json(),
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _fetchBatch(batchEntries: IterableIterator<[string, ActiveBatchValue]>) {
    const hashes: string[] = [];
    const requests: ObjectStringMap = {};

    for (const [requestHash, { request }] of batchEntries) {
      hashes.push(requestHash);
      requests[requestHash] = request;
    }

    try {
      FetchManager._resolveFetchBatch(await this._fetch(requests, hashRequest(hashes.join())), batchEntries);
    } catch (error) {
      FetchManager._rejectBatchEntries(batchEntries, error);
    }
  }

  private _updateBatch(request: string, requestHash: string, actions: BatchResultActions) {
    clearTimeout(this._activeBatchID as NodeJS.Timer);
    this._activeBatch.set(requestHash, { actions, request });

    this._activeBatchID = setTimeout(() => {
      this._fetchBatch(this._activeBatch.entries());
      this._activeBatchID = undefined;
    }, 0);
  }
}
