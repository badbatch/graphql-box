import { DocumentNode } from "graphql";
import { isArray, isBoolean, isNumber, isPlainObject } from "lodash";

import {
  ActiveBatch,
  ActiveBatchValue,
  BatchActionsObjectMap,
  BatchResultActions,
  FetchManagerFetchResult,
} from "./types";

import hashRequest from "../helpers/hash-request";

import {
  FetchManagerArgs,
  ObjectMap,
  RequestExecutorResolveResult,
  RequestOptions,
  StringObjectMap,
} from "../types";

export default class FetchManager {
  private static _rejectBatchEntries(batchEntries: BatchActionsObjectMap, error: any): void {
    Object.keys(batchEntries).forEach((requestHash) => {
      const { reject } = batchEntries[requestHash];
      reject(error);
    });
  }

  private static _resolveFetch({ headers, result }: FetchManagerFetchResult): RequestExecutorResolveResult {
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
    batchEntries: BatchActionsObjectMap,
  ): void {
    if (!isPlainObject(result)) {
      const typeError = new TypeError("ResolveFetchBatch expected result to be a plain object.");
      FetchManager._rejectBatchEntries(batchEntries, typeError);
      return;
    }

    const error = new Error("FetchManager did not receive a response for the request.");

    Object.keys(batchEntries).forEach((requestHash) => {
      const res = result[requestHash];
      const { reject, resolve } = batchEntries[requestHash];

      if (res) {
        resolve(FetchManager._resolveFetch({ headers, result: res }));
      } else {
        reject(error);
      }
    });
  }

  private _activeBatch: ActiveBatch;
  private _activeBatchTimer: NodeJS.Timer | undefined;
  private _batch: boolean = false;
  private _fetchTimeout: number = 5000;
  private _headers: ObjectMap = { "content-type": "application/json" };
  private _url: string;

  constructor({ batch, fetchTimeout, headers, url }: FetchManagerArgs) {
    if (isBoolean(batch)) this._batch = batch;
    if (isNumber(fetchTimeout)) this._fetchTimeout = fetchTimeout;
    if (headers && isPlainObject(headers)) this._headers = { ...this._headers, ...headers };
    this._url = url;
  }

  public async resolve(
    request: string,
    /**
     * The GraphQL AST document is not used
     * in this method, but is declared as an argument
     * so that the method has the same signature as
     * the GraphQLExecuteProxy resolve method.
     *
     */
    ast: DocumentNode,
    /**
     * The request options are not used
     * in this method, but are declared as an argument
     * so that the method has the same signature as
     * the GraphQLExecuteProxy resolve method.
     *
     */
    opts: RequestOptions,
  ): Promise<RequestExecutorResolveResult> {
    try {
      const requestHash = hashRequest(request);
      if (!this._batch) return FetchManager._resolveFetch(await this._fetch(request, requestHash));

      return new Promise((resolve: (value: RequestExecutorResolveResult) => void, reject) => {
        this._batchRequest(request, requestHash, { resolve, reject });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _batchRequest(request: string, requestHash: string, actions: BatchResultActions) {
    if (this._activeBatchTimer) {
      this._updateBatch(request, requestHash, actions);
    } else {
      this._createBatch(request, requestHash, actions);
    }
  }

  private _createBatch(request: string, requestHash: string, actions: BatchResultActions) {
    this._activeBatch = new Map();
    this._activeBatch.set(requestHash, { actions, request });

    this._activeBatchTimer = setTimeout(() => {
      this._fetchBatch(this._activeBatch.entries());
      this._activeBatchTimer = undefined;
    }, 0);
  }

  private async _fetch(request: string | StringObjectMap, requestHash: string): Promise<FetchManagerFetchResult> {
    try {
      return new Promise(async (resolve: (value: FetchManagerFetchResult) => void, reject) => {
        const fetchTimer = setTimeout(() => {
          reject(new Error(`Fetch did not get a response within ${this._fetchTimeout}ms.`));
        }, this._fetchTimeout);

        const url = `${this._url}?requestId=${requestHash}`;

        const fetchResult = await fetch(url, {
          body: JSON.stringify({ batched: this._batch, query: request }),
          headers: new Headers(this._headers),
          method: "POST",
        });

        clearTimeout(fetchTimer);

        resolve({
          headers: fetchResult.headers,
          result: await fetchResult.json(),
        });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _fetchBatch(batchEntries: IterableIterator<[string, ActiveBatchValue]>) {
    const hashes: string[] = [];
    const batchRequests: StringObjectMap = {};
    const batchActions: BatchActionsObjectMap = {};

    for (const [requestHash, { actions, request }] of batchEntries) {
      hashes.push(requestHash);
      batchActions[requestHash] = actions;
      batchRequests[requestHash] = request;
    }

    try {
      FetchManager._resolveFetchBatch(await this._fetch(batchRequests, hashRequest(hashes.join())), batchActions);
    } catch (error) {
      FetchManager._rejectBatchEntries(batchActions, error);
    }
  }

  private _updateBatch(request: string, requestHash: string, actions: BatchResultActions) {
    clearTimeout(this._activeBatchTimer as NodeJS.Timer);
    this._activeBatch.set(requestHash, { actions, request });

    this._activeBatchTimer = setTimeout(() => {
      this._fetchBatch(this._activeBatch.entries());
      this._activeBatchTimer = undefined;
    }, 0);
  }
}
