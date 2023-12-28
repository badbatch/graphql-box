import {
  type PartialRawFetchData,
  type PartialRequestResult,
  type RequestContext,
  type RequestData,
  type RequestOptions,
  type SubscriberResolver,
  type SubscriptionsManagerDef,
} from '@graphql-box/core';
import { type ArgsError, EventAsyncIterator, GroupedError, deserializeErrors } from '@graphql-box/helpers';
import { EventEmitter } from 'eventemitter3';
import { type UserOptions } from './types.ts';

export class WebsocketManager implements SubscriptionsManagerDef {
  private static _getMessageContext({ operation, originalRequestHash, requestID }: RequestContext) {
    return { operation, originalRequestHash, requestID };
  }

  private _eventEmitter: EventEmitter;
  private _subscriptions = new Map<string, SubscriberResolver>();
  private _websocket: WebSocket;

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!('websocket' in options)) {
      errors.push(new TypeError('@graphql-box/websocket-manager expected options.websocket.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/websocket-manager argument validation errors.', errors);
    }

    this._eventEmitter = new EventEmitter();
    this._websocket = options.websocket;

    this._websocket.addEventListener('message', (event: MessageEvent<string>) => {
      void this._onMessage(event);
    });
  }

  public subscribe(
    { hash, request }: RequestData,
    _options: RequestOptions,
    context: RequestContext,
    subscriberResolver: SubscriberResolver
  ): Promise<AsyncIterator<PartialRequestResult | undefined>> {
    if (!this._isSocketOpen()) {
      throw new Error('@graphql-box/websocket-manager expected the websocket to be open.');
    }

    this._websocket.send(
      JSON.stringify({
        context: WebsocketManager._getMessageContext(context),
        subscription: request,
        subscriptionID: hash,
      })
    );

    this._subscriptions.set(hash, result => {
      return subscriberResolver(result);
    });

    const eventAsyncIterator = new EventAsyncIterator<PartialRequestResult>(this._eventEmitter, hash);
    return Promise.resolve(eventAsyncIterator.getIterator());
  }

  private _isSocketOpen(): boolean {
    return this._websocket.readyState === 1;
  }

  private async _onMessage(event: MessageEvent<string>): Promise<void> {
    const { result, subscriptionID } = JSON.parse(event.data) as {
      result: PartialRawFetchData;
      subscriptionID: string;
    };

    const subscriberResolver = this._subscriptions.get(subscriptionID);

    if (!subscriberResolver) {
      return;
    }

    const resolvedResult = await subscriberResolver(deserializeErrors(result));
    this._eventEmitter.emit(subscriptionID, resolvedResult);
  }
}
