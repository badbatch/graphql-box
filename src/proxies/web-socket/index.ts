import { isPlainObject, isString } from "lodash";
import * as WebSocket from "ws";

export default class WebSocketProxy {
  private _address: string;
  private _options: WebSocket.ClientOptions;
  private _socket: WebSocket;
  private _subscriptions: Map<string, (data: any) => void> = new Map();

  constructor(address: string, opts?: WebSocket.ClientOptions) {
    if (!isString(address)) {
      throw new TypeError("constructor expected address to be a string.");
    }

    this._address = address;
    if (opts && isPlainObject(opts)) this._options = opts;
    this._open();
  }

  public async send(subscription: string, hash: string, callback: (data: any) => void): Promise<void> {
    return new Promise((resolve: (value: undefined) => void, reject: (reason: Error) => void) => {
      this._socket.send(JSON.stringify({ subscriptionID: hash, subscription }), (error) => {
        if (error) {
          reject(error);
        } else {
          this._subscriptions.set(hash, callback);
          resolve(undefined);
        }
      });
    });
  }

  private _onMessage(data: string): void {
    const parsedData = JSON.parse(data);
    if (!parsedData) return;
    const { result, subscriptionID } = parsedData;
    const subscriber = this._subscriptions.get(subscriptionID);
    if (!subscriber) return;
    subscriber(result);
  }

  private async _open(): Promise<void> {
    this._socket = new WebSocket(this._address, this._options);

    return new Promise((resolve: (value: undefined) => void) => {
      this._socket.on("open", () => {
        this._socket.on("message", this._onMessage);
        resolve(undefined);
      });
    });
  }
}
