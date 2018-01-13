import { isPlainObject } from "lodash";
import PromiseWorker from "promise-worker";
import createCacheMetadata from "../helpers/create-cache-metadata";

import {
  ClientArgs,
  ObjectMap,
  PostMessageArgs,
  PostMessageResult,
  RequestOptions,
  RequestResult,
  RequestResultData,
  ResponseCacheEntryResult,
} from "../types";

let instance: WorkerClient;

export class WorkerClient {
  public static async create(args: ClientArgs): Promise<WorkerClient> {
    if (instance && isPlainObject(args) && !args.newInstance) return instance;
    const webpackWorker = require("worker-loader?inline=true&fallback=false!../worker"); // tslint:disable-line
    const workerCachemap = new WorkerClient();
    workerCachemap._worker = new webpackWorker();
    workerCachemap._promiseWorker = new PromiseWorker(workerCachemap._worker);
    await workerCachemap._postMessage({ args, type: "create" });
    instance = workerCachemap;
    return instance;
  }

  private static _convertCacheabilityObjectMap({ cacheMetadata, ...otherProps }: PostMessageResult): RequestResultData {
    return { cacheMetadata: createCacheMetadata({ cacheMetadata }), ...otherProps };
  }

  private _promiseWorker: PromiseWorker;
  private _worker: Worker;

  public async clearCache(): Promise<void> {
    await this._postMessage({ type: "clearCache" });
  }

  public async getDataEntityCacheEntry(key: string): Promise<ObjectMap | undefined> {
    return this._postMessage({ key, type: "getDataPathCacheEntry" });
  }

  public async getDataEntityCacheSize(): Promise<number> {
    return this._postMessage({ type: "getDataEntityCacheSize" });
  }

  public async getDataPathCacheEntry(key: string): Promise<any> {
    return this._postMessage({ key, type: "getDataPathCacheEntry" });
  }

  public async getDataPathCacheSize(): Promise<number> {
    return this._postMessage({ type: "getDataPathCacheSize" });
  }

  public async getResponseCacheEntry(key: string): Promise<ResponseCacheEntryResult | undefined> {
    const entry = await this._postMessage({ key, type: "getResponseCacheEntry" });
    let result: ResponseCacheEntryResult | undefined;

    if (entry) {
      result = { cacheMetadata: createCacheMetadata({ cacheMetadata: entry.cacheMetadata }), data: entry.data };
    }

    return result;
  }

  public async getResponseCacheSize(): Promise<number> {
    return this._postMessage({ type: "getResponseCacheSize" });
  }

  public async request(query: string, opts: RequestOptions = {}): Promise<RequestResult> {
    const args = { query, opts, type: "request" };
    const postMessageResult = await this._postMessage(args) as PostMessageResult;
    return WorkerClient._convertCacheabilityObjectMap(postMessageResult);
  }

  public terminate(): void {
    this._worker.terminate();
  }

  private async _postMessage(args: PostMessageArgs): Promise<any> {
    let message;

    try {
      message = await this._promiseWorker.postMessage(args);
    } catch (error) {
      return Promise.reject(error);
    }

    return message;
  }
}
