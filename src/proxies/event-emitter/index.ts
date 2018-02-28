import { EventEmitter } from "events";

export default class EventEmmitterProxy {
  private _eventTarget: EventEmitter = new EventEmitter();

  public addListener(eventName: string, listener: EventListener): void {
    this._eventTarget.addListener(eventName, listener);
  }

  public emit(eventName: string, payload: any): void {
    this._eventTarget.emit(eventName, { detail: payload });
  }

  public removeListener(eventName: string, listener: EventListener): void {
    this._eventTarget.removeListener(eventName, listener);
  }
}
