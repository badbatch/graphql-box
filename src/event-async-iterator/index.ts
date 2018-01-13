import { $$asyncIterator } from "iterall";
import EventEmitterProxy from "../proxies/event-emitter";
import EventTargetProxy from "../proxies/event-target";

export default class EventAsyncIterator {
  private _eventEmitter: EventEmitterProxy | EventTargetProxy;
  private _eventName: string;
  private _listening: boolean = false;
  private _pullQueue: Array<(value: IteratorResult<Event | undefined>) => void> = [];
  private _pushQueue: Event[] = [];

  constructor(eventEmitter: EventEmitterProxy | EventTargetProxy, eventName: string) {
    this._eventEmitter = eventEmitter;
    this._eventName = eventName;
    this._addEventListener();
  }

  public getIterator(): AsyncIterator<Event | undefined> {
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
    this._eventEmitter.addListener(this._eventName, this._pushValue.bind(this));
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

  private _next(): Promise<IteratorResult<Event | undefined>> {
    return this._listening ? this._pullValue() : this._return();
  }

  private _pullValue(): Promise<IteratorResult<Event>> {
    return new Promise((resolve: (value: IteratorResult<Event>) => void) => {
      if (this._pushQueue.length !== 0) {
        resolve({
          done: false,
          value: this._pushQueue.shift() as Event,
        });
      } else {
        this._pullQueue.push(resolve);
      }
    });
  }

  private _pushValue(event: Event): void {
    if (this._pullQueue.length !== 0) {
      const resolver = this._pullQueue.shift() as (value: IteratorResult<Event | undefined>) => void;
      resolver({ value: event, done: false });
    } else {
      this._pushQueue.push(event);
    }
  }

  private _removeEventListener(): void {
    this._eventEmitter.removeListener(this._eventName, this._pushValue.bind(this));
  }

  private _return(): Promise<IteratorResult<Event | undefined>> {
    this._emptyQueue();
    return Promise.resolve({ value: undefined, done: true });
  }

  private _throw(error: Error): Promise<void> {
    this._emptyQueue();
    return Promise.reject(error);
  }
}
