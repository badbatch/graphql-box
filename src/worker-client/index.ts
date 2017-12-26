import PromiseWorker from "promise-worker";

import {
  ClientArgs,
  PostMessageArgs,
  RequestOptions,
  RequestResult,
} from "../types";

export default class WorkerClient {
  public static async create(args: ClientArgs): Promise<WorkerClient> {
    const webpackWorker = require("worker-loader?inline=true&fallback=false!../worker"); // tslint:disable-line
    const workerCachemap = new WorkerClient();
    workerCachemap._worker = new webpackWorker();
    workerCachemap._promiseWorker = new PromiseWorker(workerCachemap._worker);
    await workerCachemap._postMessage({ args, type: "create" });
    return workerCachemap;
  }

  private _promiseWorker: PromiseWorker;
  private _worker: Worker;

  public async clearCache(): Promise<void> {
    await this._postMessage({ type: "clearCache" });
  }

  public async request(query: string, opts: RequestOptions = {}): Promise<RequestResult | RequestResult[]> {
    let result: RequestResult | RequestResult[];

    try {
      result = await this._postMessage({ query, opts, type: "request" });
    } catch (error) {
      return Promise.reject(error);
    }

    return result;
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
