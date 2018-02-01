import { isPlainObject, isString } from "lodash";
import * as md5 from "md5";
import PromiseWorker from "promise-worker";
import EventAsyncIterator from "../event-async-iterator";
import createCacheMetadata from "../helpers/create-cache-metadata";
import EventTargetProxy from "../proxies/event-target";

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

    try {
      const workerClient = new WorkerClient(args);
      const webpackWorker = require("worker-loader?inline=true&fallback=false!../worker"); // tslint:disable-line
      workerClient._createWorker(webpackWorker);
      await workerClient._postMessage({ args, type: "create" });
      instance = workerClient;
      return instance;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private static _buildSubscriptionID(concatQuery: string, variables?: ObjectMap): string {
    let id = concatQuery.replace(/\s/g, "");
    if (variables) id += JSON.stringify(variables);
    return md5(id);
  }

  private static _convertCacheabilityObjectMap({ cacheMetadata, ...otherProps }: PostMessageResult): RequestResultData {
    return { cacheMetadata: createCacheMetadata({ cacheMetadata }), ...otherProps };
  }

  private static _isSubscription(concatQuery: string): boolean {
    return concatQuery.startsWith("subscription");
  }

  private _eventEmitter: EventTargetProxy;
  private _promiseWorker: PromiseWorker;
  private _subscriptionsEnabled: boolean = false;
  private _worker: Worker;

  constructor(args: ClientArgs) {
    if (args.subscriptions && isPlainObject(args.subscriptions)) {
      this._eventEmitter = new EventTargetProxy();
      this._subscriptionsEnabled = true;
    }
  }

  public async clearCache(): Promise<void> {
    try {
      await this._postMessage({ type: "clearCache" });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getDataEntityCacheEntry(key: string): Promise<ObjectMap | undefined> {
    try {
      return this._postMessage({ key, type: "getDataPathCacheEntry" });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getDataEntityCacheSize(): Promise<number> {
    try {
      return this._postMessage({ type: "getDataEntityCacheSize" });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getDataPathCacheEntry(key: string): Promise<any> {
    try {
      return this._postMessage({ key, type: "getDataPathCacheEntry" });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getDataPathCacheSize(): Promise<number> {
    try {
      return this._postMessage({ type: "getDataPathCacheSize" });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getResponseCacheEntry(key: string): Promise<ResponseCacheEntryResult | undefined> {
    try {
      const entry = await this._postMessage({ key, type: "getResponseCacheEntry" });
      let result: ResponseCacheEntryResult | undefined;

      if (entry) {
        result = {
          cacheMetadata: createCacheMetadata({ cacheMetadata: entry.cacheMetadata }),
          data: entry.data,
        };
      }

      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getResponseCacheSize(): Promise<number> {
    try {
      return this._postMessage({ type: "getResponseCacheSize" });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async request(query: string, opts: RequestOptions = {}): Promise<RequestResult> {
    if (!isString(query)) {
      return Promise.reject(new TypeError("Request expected query to be a string."));
    }

    try {
      if (this._subscriptionsEnabled) {
        const concatQuery = query.replace(/\s/g, "");

        if (WorkerClient._isSubscription(concatQuery)) {
          const key = WorkerClient._buildSubscriptionID(query, opts.variables);
          this._postMessage({ key, query, opts, type: "request" });
          const eventAsyncIterator = new EventAsyncIterator(this._eventEmitter, key);
          return eventAsyncIterator.getIterator();
        }
      }

      const postMessageResult = await this._postMessage({ query, opts, type: "request" }) as PostMessageResult;
      return WorkerClient._convertCacheabilityObjectMap(postMessageResult);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public terminate(): void {
    try {
      this._worker.terminate();
    } catch (error) {
      throw error;
    }
  }

  private _createWorker(webpackWorker: any): void {
    this._worker = new webpackWorker();
    this._worker.onmessage = this._onMessage.bind(this);
    this._promiseWorker = new PromiseWorker(this._worker);
  }

  private async _onMessage(ev: MessageEvent): Promise<void> {
    if (!ev.data || !isPlainObject(ev.data)) return;
    const { result, subscriptionID, type } = ev.data;
    if (type !== "subscription") return;
    this._eventEmitter.emit(subscriptionID, result);
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
