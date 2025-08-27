import { type ResponseData } from '@graphql-box/core';
import { EventAsyncIterator } from '@graphql-box/helpers';
import { EventEmitter } from 'eventemitter3';

const eventEmitter = new EventEmitter();

export const publish = (eventName: string, payload: unknown): void => {
  eventEmitter.emit(eventName, payload);
};

export const subscribe = (eventName: string): AsyncIterator<ResponseData | undefined> => {
  const eventAsyncIterator = new EventAsyncIterator<ResponseData>(eventEmitter, eventName);
  return eventAsyncIterator.getIterator();
};
