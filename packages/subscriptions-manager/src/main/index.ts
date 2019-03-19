import { MaybeRequestResult, RequestDataWithMaybeAST, RequestOptions } from "@handl/core";
import EventEmitter from "eventemitter3";
import { isPlainObject } from "lodash";
import {
  ConstructorOptions,
  InitOptions,
  SubscriberResolver,
  SubscriptionsManagerDef,
  SubscriptionsManagerInit,
  UserOptions,
} from "../defs";
import EventAsyncIterator from "../helpers/event-async-iterator";

export class SubscriptionsManager implements SubscriptionsManagerDef {
  public static async init(options: InitOptions): Promise<SubscriptionsManager> {
    const errors: TypeError[] = [];

    if (!options.websocket) {
       errors.push(new TypeError("@handl/subscriptions-manager expected options.websocket."));
    }

    if (errors.length) return Promise.reject(errors);

    try {
      return new SubscriptionsManager(options);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _eventEmitter: EventEmitter;
  private _subscriptions: Map<string, SubscriberResolver> = new Map();
  private _websocket: WebSocket;

  constructor(options: ConstructorOptions) {
    this._eventEmitter = new EventEmitter();
    options.websocket.onmessage = this._onMessage.bind(this);
    this._websocket = options.websocket;
  }

  public async subscribe(
    { hash, request }: RequestDataWithMaybeAST,
    options: RequestOptions,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterator<MaybeRequestResult | undefined>> {
    if (!this._isSocketOpen()) {
      return Promise.reject(new Error("@handl/subscriptions-manager expected the websocket to be open."));
    }

    try {
      this._websocket.send(JSON.stringify({ subscriptionID: hash, subscription: request }));
      this._subscriptions.set(hash, subscriberResolver);
      const eventAsyncIterator = new EventAsyncIterator(this._eventEmitter, hash);
      return eventAsyncIterator.getIterator();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _isSocketOpen(): boolean {
    return this._websocket.readyState === 1;
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
}

export default function init(userOptions: UserOptions): SubscriptionsManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@handl/subscriptions-manager expected userOptions to be a plain object.");
  }

  return () => SubscriptionsManager.init(userOptions);
}
