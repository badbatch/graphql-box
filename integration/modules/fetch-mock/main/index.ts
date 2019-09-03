import { isPlainObject } from "lodash";
import { FETCH_MOCK, MESSAGE } from "../consts";
import {
  FetchMockMessageResponse,
  FetchMockMethods,
  FetchMockPostMessageOptions,
  PendingResolver,
  PendingTracker,
} from "../defs";
import { rehydrateFetchMock } from "../helpers";

export default class FetchMockWorker {
  private _messageID: number = 0;
  private _pending: PendingTracker = new Map();
  private _worker: Worker;

  constructor(worker: Worker) {
    this._worker = worker;
    this._addEventListener();
  }

  public async postMessage(method: FetchMockMethods, options?: FetchMockPostMessageOptions): Promise<any> {
    this._messageID += 1;

    try {
      return new Promise((resolve: PendingResolver) => {
        this._worker.postMessage({
          messageID: this._messageID,
          method,
          options,
          type: FETCH_MOCK,
        });

        this._pending.set(this._messageID, { resolve });
      });
    } catch (errors) {
      return Promise.reject(errors);
    }
  }

  private _addEventListener(): void {
    this._worker.addEventListener(MESSAGE, this._onMessage);
  }

  private _onMessage = async ({ data }: MessageEvent): Promise<void> => {
    if (!isPlainObject(data)) return;

    const { messageID, result, type } = data as FetchMockMessageResponse;
    if (type !== FETCH_MOCK) return;

    const pending = this._pending.get(messageID);
    if (!pending) return;

    pending.resolve(rehydrateFetchMock(result));
  };
}
