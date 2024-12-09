import { type Client } from '@graphql-box/client';
import {
  type PartialDehydratedRequestResult,
  type PartialRequestResult,
  type ServerSocketRequestOptions,
} from '@graphql-box/core';
import { ArgsError, GroupedError, dehydrateCacheMetadata, serializeErrors } from '@graphql-box/helpers';
import { forAwaitEach, isAsyncIterable } from 'iterall';
import { isError, isPlainObject } from 'lodash-es';
import { type Data } from 'ws';
import { type MessageData, type UserOptions, type WsMessageHandler } from './types.ts';

export class WebsocketMiddleware {
  private _client: Client;
  private _requestTimeout: number;
  private _requestWhitelist: string[];

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@graphql-box/server expected options to ba a plain object.'));
    }

    if (!('client' in options)) {
      errors.push(new ArgsError('@graphql-box/server expected options.client.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/server argument validation errors.', errors);
    }

    this._client = options.client;
    this._requestTimeout = options.requestTimeout ?? 10_000;
    this._requestWhitelist = options.requestWhitelist ?? [];
  }

  public createMessageHandler(options: ServerSocketRequestOptions): WsMessageHandler {
    return (message: Data) => {
      void this._messageHandler(message, options);
    };
  }

  private async _messageHandler(message: Data, { ws, ...rest }: ServerSocketRequestOptions): Promise<void> {
    try {
      const { context, subscription, subscriptionID } = JSON.parse(message as string) as MessageData;

      if (this._requestWhitelist.length > 0 && !this._requestWhitelist.includes(context.originalRequestHash)) {
        ws.send(JSON.stringify(serializeErrors({ errors: [new Error('The request is not whitelisted.')] })));
        return;
      }

      const requestTimer = setTimeout(() => {
        ws.send(
          JSON.stringify(
            serializeErrors({
              errors: [new Error(`@graphql-box/server did not process the request within ${this._requestTimeout}ms.`)],
            }),
          ),
        );
      }, this._requestTimeout);

      const subscribeResult = await this._client.subscribe(subscription, rest, context);
      clearTimeout(requestTimer);

      if (!isAsyncIterable(subscribeResult)) {
        ws.send(JSON.stringify(serializeErrors(subscribeResult as PartialRequestResult)));
        return;
      }

      void forAwaitEach(subscribeResult, ({ _cacheMetadata, ...otherProps }: PartialRequestResult) => {
        if (ws.readyState === ws.OPEN) {
          const result: PartialDehydratedRequestResult = serializeErrors({ ...otherProps });

          if (_cacheMetadata) {
            result._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
          }

          ws.send(JSON.stringify({ result, subscriptionID }));
        }
      });
    } catch (error) {
      const confirmedError = isError(error)
        ? error
        : new Error('@graphql-box/server messageHandler had an unexpected error.');

      ws.send(JSON.stringify(serializeErrors({ errors: [confirmedError] })));
    }
  }
}
