import { type PartialRequestResult } from '@graphql-box/core';
import { EventAsyncIterator } from '@graphql-box/helpers';
import { EventEmitter } from 'eventemitter3';

const eventEmitter = new EventEmitter();

export const publish = (eventName: string, payload: unknown): void => {
  eventEmitter.emit(eventName, payload);
};

export const subscribe = (eventName: string): AsyncIterator<PartialRequestResult | undefined> => {
  const eventAsyncIterator = new EventAsyncIterator<PartialRequestResult>(eventEmitter, eventName);
  return eventAsyncIterator.getIterator();
};
