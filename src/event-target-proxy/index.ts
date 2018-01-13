export default class EventTargetProxy {
  private _eventTarget: EventTarget = self;

  public addListener(eventName: string | symbol, listener: (...args: any[]) => void): void {
    this._eventTarget.addEventListener(eventName as string, listener);
  }

  public emit(eventName: string, payload: any): void {
    const event = new CustomEvent(eventName, { detail: payload });
    this._eventTarget.dispatchEvent(event);
  }

  public removeListener(eventName: string | symbol, listener: (...args: any[]) => void): void {
    this._eventTarget.removeEventListener(eventName as string, listener);
  }
}
