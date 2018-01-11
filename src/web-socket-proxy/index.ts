import { isString } from "lodash";
import { InternalSubscriber } from "../types";

let websocket: typeof WebSocket;

if (process.env.WEB_ENV) {
  websocket = WebSocket;
} else {
  websocket = require("ws");
}

export default class WebSocketProxy {
  private _address: string;
  private _closedCode?: number;
  private _closedReason?: string;
  private _socket: WebSocket;
  private _subscriptions: Map<string, InternalSubscriber> = new Map();

  constructor(address: string) {
    if (!isString(address)) {
      throw new TypeError("constructor expected address to be a string.");
    }

    this._address = address;
    this._open();
  }

  public async send(
    subscription: string,
    hash: string,
    subscriber: InternalSubscriber,
  ): Promise<{ subscribed: boolean }> {
    if (this._isClosed()) {
      return Promise.reject(new Error(`The websocket is closed. ${this._closedCode}: ${this._closedReason}`));
    }

    if (!this._isOpen()) {
      return Promise.reject(new Error("The websocket is not open."));
    }

    this._subscriptions.set(hash, subscriber);
    this._socket.send(JSON.stringify({ subscriptionID: hash, subscription }));
    return { subscribed: true };
  }

  private _isClosed(): boolean {
    return this._socket.readyState === 2 || this._socket.readyState === 3;
  }

  private _isOpen(): boolean {
    return this._socket.readyState === 1;
  }

  private _onClose(ev: CloseEvent): void {
    if (!ev.wasClean) {
      this._closedCode = ev.code;
      this._closedReason = ev.reason;
      this._open();
    }
  }

  private _onMessage(ev: MessageEvent): void {
    const parsedData = JSON.parse(ev.data);
    if (!parsedData) return;
    const { result, subscriptionID } = parsedData;
    const subscriber = this._subscriptions.get(subscriptionID);
    if (!subscriber) return;
    subscriber(result);
  }

  private _onOpen(): void {
    this._closedCode = undefined;
    this._closedReason = undefined;
  }

  private async _open(): Promise<void> {
    this._socket = new websocket(this._address);
    this._socket.onclose = this._onClose.bind(this);
    this._socket.onmessage = this._onMessage.bind(this);
    this._socket.onopen = this._onOpen.bind(this);
  }
}
