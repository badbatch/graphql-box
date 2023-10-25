import { type EventEmitter } from 'eventemitter3';
import { $$asyncIterator } from 'iterall';

export class EventAsyncIterator<RequestResult> {
  private _pushValue = (result: RequestResult): void => {
    if (this._pullQueue.length > 0) {
      const resolver = this._pullQueue.shift() as (value: IteratorResult<RequestResult>) => void;
      resolver({ done: false, value: result });
    } else {
      this._pushQueue.push(result);
    }
  };

  private _eventEmitter: EventEmitter;
  private _eventName: string;
  private _listening = false;
  private _pullQueue: ((value: IteratorResult<RequestResult | undefined>) => void)[] = [];
  private _pushQueue: RequestResult[] = [];

  constructor(eventEmitter: EventEmitter, eventName: string) {
    this._eventEmitter = eventEmitter;
    this._eventName = eventName;
    this._pushValue = this._pushValue.bind(this);
    this._addEventListener();
  }

  public getIterator(): AsyncIterableIterator<RequestResult | undefined> {
    return {
      // @ts-expect-error Object literal may only specify known properties
      [$$asyncIterator]() {
        return this;
      },
      next: this._next.bind(this),
      return: this._return.bind(this),
      throw: this._throw.bind(this),
    };
  }

  private _addEventListener(): void {
    this._eventEmitter.on(this._eventName, this._pushValue);
    this._listening = true;
  }

  private _emptyQueue(): void {
    if (this._listening) {
      this._listening = false;
      this._removeEventListener();

      for (const resolve of this._pullQueue) {
        resolve({ done: true, value: undefined });
      }

      this._pullQueue.length = 0;
      this._pushQueue.length = 0;
    }
  }

  private _next(): Promise<IteratorResult<RequestResult | undefined>> {
    return this._listening ? this._pullValue() : this._return();
  }

  private _pullValue(): Promise<IteratorResult<RequestResult | undefined>> {
    return new Promise((resolve: (value: IteratorResult<RequestResult | undefined>) => void) => {
      if (this._pushQueue.length > 0) {
        const result = this._pushQueue.shift() as RequestResult;
        resolve({ done: false, value: result });
      } else {
        this._pullQueue.push(resolve);
      }
    });
  }

  private _removeEventListener(): void {
    this._eventEmitter.removeListener(this._eventName, this._pushValue);
  }

  private _return(): Promise<IteratorResult<RequestResult | undefined>> {
    this._emptyQueue();
    return Promise.resolve({ done: true, value: undefined });
  }

  private _throw(error: Error): Promise<IteratorResult<RequestResult | undefined>> {
    this._emptyQueue();
    return Promise.reject(error);
  }
}
