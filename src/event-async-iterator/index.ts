import { $$asyncIterator } from "iterall";
import * as EventEmitter from "eventemitter3";
import { RequestResultData, ResolveResult } from "../types";

export default class EventAsyncIterator {
  private _eventEmitter: EventEmitter;
  private _eventName: string;
  private _listening: boolean = false;
  private _pullQueue: Array<(value: IteratorResult<ResolveResult | undefined>) => void> = [];
  private _pushQueue: RequestResultData[] = [];

  constructor(eventEmitter: EventEmitter, eventName: string) {
    this._eventEmitter = eventEmitter;
    this._eventName = eventName;
    this._addEventListener();
  }

  public getIterator(): AsyncIterator<ResolveResult | undefined> {
    return {
      next: this._next.bind(this),
      return: this._return.bind(this),
      throw: this._throw.bind(this),
      [$$asyncIterator]() {
        return this;
      },
    };
  }

  private _addEventListener(): void {
    this._eventEmitter.on(this._eventName, this._pushValue.bind(this));
    this._listening = true;
  }

  private _emptyQueue(): void {
    if (this._listening) {
      this._listening = false;
      this._removeEventListener();
      this._pullQueue.forEach((resolve) => resolve({ value: undefined, done: true }));
      this._pullQueue.length = 0;
      this._pushQueue.length = 0;
    }
  }

  private _next(): Promise<IteratorResult<ResolveResult | undefined>> {
    return this._listening ? this._pullValue() : this._return();
  }

  private _pullValue(): Promise<IteratorResult<ResolveResult>> {
    return new Promise((resolve: (value: IteratorResult<ResolveResult>) => void) => {
      if (this._pushQueue.length !== 0) {
        const result = this._pushQueue.shift() as RequestResultData;

        resolve({
          done: false,
          value: result,
        });
      } else {
        this._pullQueue.push(resolve);
      }
    });
  }

  private _pushValue(result: RequestResultData): void {
    if (this._pullQueue.length !== 0) {
      const resolver = this._pullQueue.shift() as (value: IteratorResult<ResolveResult | undefined>) => void;
      resolver({ value: result, done: false });
    } else {
      this._pushQueue.push(result);
    }
  }

  private _removeEventListener(): void {
    this._eventEmitter.removeListener(this._eventName, this._pushValue.bind(this));
  }

  private _return(): Promise<IteratorResult<ResolveResult | undefined>> {
    this._emptyQueue();
    return Promise.resolve({ value: undefined, done: true });
  }

  private _throw(error: Error): Promise<void> {
    this._emptyQueue();
    return Promise.reject(error);
  }
}
