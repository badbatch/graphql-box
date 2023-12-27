import { isPlainObject } from '../../../packages/helpers/src/lodashProxies.ts';
import { FETCH_MOCK, MESSAGE } from './constants.ts';
import { rehydrateFetchMock } from './helpers.ts';
import {
  type FetchMockMessageResponse,
  type FetchMockMethods,
  type FetchMockPostMessageOptions,
  type PendingResolver,
  type PendingTracker,
} from './types.ts';

export class FetchMockWorker {
  private _onMessage = ({ data }: MessageEvent<FetchMockMessageResponse>) => {
    if (!isPlainObject(data)) {
      return;
    }

    const { messageID, result, type } = data;

    if (type !== FETCH_MOCK) {
      return;
    }

    const pending = this._pending.get(messageID);

    if (!pending) {
      return;
    }

    pending.resolve(rehydrateFetchMock(result));
  };

  private _messageID = 0;
  private _pending: PendingTracker = new Map();
  private _worker: Worker;

  constructor(worker: Worker) {
    this._worker = worker;
    this._addEventListener();
  }

  public async postMessage(method: FetchMockMethods, options?: FetchMockPostMessageOptions) {
    this._messageID += 1;

    return new Promise((resolve: PendingResolver) => {
      this._worker.postMessage({
        messageID: this._messageID,
        method,
        options,
        type: FETCH_MOCK,
      });

      this._pending.set(this._messageID, { resolve });
    });
  }

  private _addEventListener(): void {
    this._worker.addEventListener(MESSAGE, this._onMessage);
  }
}
