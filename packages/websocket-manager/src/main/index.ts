import {
  RequestContext,
  RequestData,
  RequestOptions,
  SubscriptionsManagerDef,
  SubscriptionsManagerResult,
  SubscriptionsManagerSubscribeResolver,
  WebsocketResult,
} from "@graphql-box/core";
import { EventAsyncIterator, deserializeErrors, rehydrateCacheMetadata } from "@graphql-box/helpers";
import EventEmitter from "eventemitter3";
import { UserOptions } from "../defs";

export default class WebsocketManager implements SubscriptionsManagerDef {
  private static _getMessageContext({ operation, requestID, whitelistHash }: RequestContext) {
    return { operation, requestID, whitelistHash };
  }

  private _eventEmitter: EventEmitter;
  private _subscriptions: Map<string, SubscriptionsManagerSubscribeResolver> = new Map();
  private _websocket: WebSocket;

  constructor(options: UserOptions) {
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
    { hash, request }: RequestData,
    _options: RequestOptions,
    context: RequestContext,
    subscriberResolver: SubscriptionsManagerSubscribeResolver,
  ): Promise<AsyncIterableIterator<SubscriptionsManagerResult | undefined>> {
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

      this._subscriptions.set(hash, result => {
        return subscriberResolver(result);
      });

      const eventAsyncIterator = new EventAsyncIterator<SubscriptionsManagerResult>(this._eventEmitter, hash);
      return eventAsyncIterator.getIterator();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _isSocketOpen(): boolean {
    return this._websocket.readyState === 1;
  }

  private async _onMessage(ev: MessageEvent): Promise<void> {
    const websocketResult = JSON.parse(ev.data) as WebsocketResult | undefined;

    if (!websocketResult) {
      return;
    }

    const { result, subscriptionID } = websocketResult;
    const subscriberResolver = this._subscriptions.get(subscriptionID);

    if (!subscriberResolver) {
      return;
    }

    this._eventEmitter.emit(
      subscriptionID,
      await subscriberResolver(
        deserializeErrors({ ...result, _cacheMetadata: rehydrateCacheMetadata(result._cacheMetadata) }),
      ),
    );
  }
}
