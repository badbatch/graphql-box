export default class EventTargetProxy {
  private _eventTarget: EventTarget = self;

  public addListener(eventName: string, listener: EventListener): void {
    this._eventTarget.addEventListener(eventName, listener);
  }

  public emit(eventName: string, payload: any): void {
    const event = new CustomEvent(eventName, { detail: payload });
    this._eventTarget.dispatchEvent(event);
  }

  public removeListener(eventName: string, listener: EventListener): void {
    this._eventTarget.removeEventListener(eventName, listener);
  }
}
