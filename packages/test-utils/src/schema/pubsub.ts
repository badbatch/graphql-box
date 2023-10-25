import { type PartialRequestResult } from '@graphql-box/core';
import { EventAsyncIterator } from '@graphql-box/helpers';
import { EventEmitter } from 'eventemitter3';

const eventEmitter = new EventEmitter();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const publish = (eventName: string, payload: any): void => {
  eventEmitter.emit(eventName, payload);
};

export const subscribe = (eventName: string): AsyncIterator<PartialRequestResult | undefined> => {
  const eventAsyncIterator = new EventAsyncIterator<PartialRequestResult>(eventEmitter, eventName);
  return eventAsyncIterator.getIterator();
};
