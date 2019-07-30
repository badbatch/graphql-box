import { MaybeRequestResult } from "@graphql-box/core";
import { EventAsyncIterator } from "@graphql-box/helpers";
import EventEmitter from "eventemitter3";

const eventEmitter = new EventEmitter();

export function publish(eventName: string, payload: any): void {
  eventEmitter.emit(eventName, payload);
}

export function subscribe(eventName: string): AsyncIterator<MaybeRequestResult | undefined> {
  const eventAsyncIterator = new EventAsyncIterator(eventEmitter, eventName);
  return eventAsyncIterator.getIterator();
}
