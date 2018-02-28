import { DocumentNode } from "graphql";
import { isPlainObject, isString } from "lodash";
import * as WS from "ws";
import EventAsyncIterator from "../event-async-iterator";
import EventEmitterProxy from "../proxies/event-emitter";
import EventTargetProxy from "../proxies/event-target";
import { RequestOptions, SubscriberResolver } from "../types";

let eventEmitter: typeof EventEmitterProxy | typeof EventTargetProxy;

if (process.env.WEB_ENV) {
  eventEmitter = EventTargetProxy;
} else {
  eventEmitter = require("../proxies/event-emitter").default;
}

export default class SocketManager {
  private _address: string;
  private _closedCode?: number;
  private _closedReason?: string;
  private _eventEmitter: EventEmitterProxy | EventTargetProxy;
  private _options: WS.ClientOptions = {};
  private _socket: WebSocket | WS;
  private _subscriptions: Map<string, SubscriberResolver> = new Map();

  constructor(address: string, opts?: WS.ClientOptions) {
    if (!isString(address)) {
      throw new TypeError("Constructor expected address to be a string.");
    }

    this._address = address;
    this._eventEmitter = new eventEmitter();
    if (opts && isPlainObject(opts)) this._options = opts;
    this._open();
  }

  public async resolve(
    subscription: string,
    hash: string,
    /**
     * The GraphQL AST document is not used
     * in this method, but is declared as an argument
     * so that the method as the same signature as
     * the GraphQLSubscribeProxy resolve method.
     *
     */
    ast: DocumentNode,
    subscriberResolver: SubscriberResolver,
    /**
     * The request options not used
     * in this method, but are declared as an argument
     * so that the method as the same signature as
     * the GraphQLSubscribeProxy resolve method.
     *
     */
    opts: RequestOptions,
  ): Promise<AsyncIterator<any>> {
    if (this._isClosed()) {
      const reason = this._closedCode && this._closedReason ? `${this._closedCode}: ${this._closedReason}` : "";
      return Promise.reject(new Error(`The websocket is closed. ${reason}`));
    }

    if (!this._isOpen()) {
      return Promise.reject(new Error("The websocket is not open."));
    }

    try {
      this._socket.send(JSON.stringify({ subscriptionID: hash, subscription }));
      this._subscriptions.set(hash, subscriberResolver);
      const eventAsyncIterator = new EventAsyncIterator(this._eventEmitter, hash);
      return eventAsyncIterator.getIterator();
    } catch (error) {
      return Promise.reject(error);
    }
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

  private async _onMessage(ev: MessageEvent): Promise<void> {
    const parsedData = JSON.parse(ev.data);
    if (!parsedData) return;
    const { result, subscriptionID } = parsedData;
    const subscriberResolver = this._subscriptions.get(subscriptionID);
    if (!subscriberResolver) return;
    const resolvedResult = await subscriberResolver(result);
    this._eventEmitter.emit(subscriptionID, resolvedResult);
  }

  private _onOpen(): void {
    this._closedCode = undefined;
    this._closedReason = undefined;
  }

  private async _open(): Promise<void> {
    try {
      if (process.env.WEB_ENV) {
        const websocket = WebSocket;
        this._socket = new websocket(this._address);
      } else {
        const websocket = require("ws");
        this._socket = new websocket(this._address, this._options);
      }

      this._socket.onclose = this._onClose.bind(this);
      this._socket.onmessage = this._onMessage.bind(this);
      this._socket.onopen = this._onOpen.bind(this);
    } catch (error) {
      // no catch
    }
  }
}
