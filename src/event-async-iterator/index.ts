import { $$asyncIterator } from "iterall";
import { EventEmitter } from "events";
import EventTargetProxy from "../event-target-proxy";

export function eventAsyncIterator(
  eventEmitter: EventEmitter | EventTargetProxy,
  eventName: string,
): AsyncIterator<Event | undefined> {
  const pullQueue: Array<(value: IteratorResult<Event | undefined>) => void> = [];
  const pushQueue: Event[] = [];
  let listening = true;

  const pushValue = (event: Event) => {
    if (pullQueue.length !== 0) {
      const resolver = pullQueue.shift() as (value: IteratorResult<Event | undefined>) => void;
      resolver({ value: event, done: false });
    } else {
      pushQueue.push(event);
    }
  };

  const pullValue = () => {
    return new Promise((resolve: (value: IteratorResult<Event>) => void) => {
      if (pushQueue.length !== 0) {
        resolve({
          done: false,
          value: pushQueue.shift() as Event,
        });
      } else {
        pullQueue.push(resolve);
      }
    });
  };

  const emptyQueue = () => {
    if (listening) {
      listening = false;
      removeEventListeners();
      pullQueue.forEach((resolve) => resolve({ value: undefined, done: true }));
      pullQueue.length = 0;
      pushQueue.length = 0;
    }
  };

  const addEventListeners = () => {
    eventEmitter.addListener(eventName, pushValue);
  };

  const removeEventListeners = () => {
    eventEmitter.removeListener(eventName, pushValue);
  };

  addEventListeners();

  return {
    next(): Promise<IteratorResult<Event | undefined>> {
      return listening ? pullValue() : this.return();
    },
    return(): Promise<IteratorResult<Event | undefined>> {
      emptyQueue();
      return Promise.resolve({ value: undefined, done: true });
    },
    throw(error: Error) {
      emptyQueue();
      return Promise.reject(error);
    },
    [$$asyncIterator]() {
      return this;
    },
  };
}
