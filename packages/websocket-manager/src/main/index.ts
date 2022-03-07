import {
  MaybeRequestContext,
  MaybeRequestResult,
  RequestContext,
  RequestDataWithMaybeAST,
  RequestOptions,
  SubscriberResolver,
  SubscriptionsManagerDef,
  SubscriptionsManagerInit,
} from "@graphql-box/core";
import { EventAsyncIterator } from "@graphql-box/helpers";
import EventEmitter from "eventemitter3";
import { isPlainObject } from "lodash";
import { ConstructorOptions, UserOptions } from "../defs";

export class WebsocketManager implements SubscriptionsManagerDef {
  private static _getMessageContext({ boxID, operation }: RequestContext): MaybeRequestContext {
    return { boxID, operation };
  }

  private _eventEmitter: EventEmitter;
  private _subscriptions: Map<string, SubscriberResolver> = new Map();
  private _websocket: WebSocket;

  constructor(options: ConstructorOptions) {
    const errors: TypeError[] = [];

    if (!options.websocket) {
      errors.push(new TypeError("@graphql-box/websocket-manager expected options.websocket."));
    }

    if (errors.length) {
      throw errors;
    }

    this._eventEmitter = new EventEmitter();
    options.websocket.onmessage = this._onMessage.bind(this);
    this._websocket = options.websocket;
  }

  public async subscribe(
    { hash, request }: RequestDataWithMaybeAST,
    _options: RequestOptions,
    context: RequestContext,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterator<MaybeRequestResult | undefined>> {
    if (!this._isSocketOpen()) {
      return Promise.reject(new Error("@graphql-box/websocket-manager expected the websocket to be open."));
    }

    try {
      this._websocket.send(
        JSON.stringify({
          context: WebsocketManager._getMessageContext(context),
          subscription: request,
          subscriptionID: hash,
        }),
      );

      this._subscriptions.set(hash, subscriberResolver);
      const eventAsyncIterator = new EventAsyncIterator<MaybeRequestResult>(this._eventEmitter, hash);
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
    throw new TypeError("@graphql-box/websocket-manager expected userOptions to be a plain object.");
  }

  return () => new WebsocketManager(userOptions);
}
