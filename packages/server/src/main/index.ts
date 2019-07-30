import Client from "@graphql-box/client";
import {
  MaybeRequestContext,
  MaybeRequestResult,
  MaybeRequestResultWithDehydratedCacheMetadata,
  PlainObjectStringMap,
  ServerRequestOptions,
  ServerSocketRequestOptions,
} from "@graphql-box/core";
import { dehydrateCacheMetadata } from "@graphql-box/helpers";
import { Request, Response } from "express";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { isPlainObject } from "lodash";
import { Data } from "ws";
import {
  ConstructorOptions,
  MessageHandler,
  RequestData,
  RequestHandler,
  ResponseDataWithMaybeDehydratedCacheMetadataBatch,
  UserOptions,
} from "../defs";

export default class Server {
  public static async init(options: UserOptions): Promise<Server> {
    const errors: TypeError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@graphql-box/server expected options to ba a plain object."));
    }

    if (!options.client) {
      errors.push(new TypeError("@graphql-box/server expected options.client."));
    }

    if (errors.length) return Promise.reject(errors);

    return new Server(options);
  }

  private _client: Client;

  constructor({ client }: ConstructorOptions) {
    this._client = client;
  }

  public request(options: ServerRequestOptions = {}): RequestHandler {
    return (req: Request, res: Response) => {
      this._requestHandler(req, res, options);
    };
  }

  public message(options: ServerSocketRequestOptions): MessageHandler {
    return (message: Data) => {
      this._messageHandler(message, options);
    };
  }

  private async _handleBatchRequest(
    requests: PlainObjectStringMap,
    options: ServerRequestOptions,
    context: MaybeRequestContext,
  ): Promise<ResponseDataWithMaybeDehydratedCacheMetadataBatch> {
    const responses: ResponseDataWithMaybeDehydratedCacheMetadataBatch = {};

    await Promise.all(Object.keys(requests).map(async (requestHash) => {
      const request = requests[requestHash];
      const { _cacheMetadata, ...otherProps } = await this._client.request(request, options, context);

      responses[requestHash] = { ...otherProps };
      if (_cacheMetadata) responses[requestHash]._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
    }));

    return responses;
  }

  private async _handleRequest(
    request: string,
    options: ServerRequestOptions,
    context: MaybeRequestContext,
  ): Promise<MaybeRequestResultWithDehydratedCacheMetadata> {
    const { _cacheMetadata, ...otherProps } = await this._client.request(request, options, context);
    const response: MaybeRequestResultWithDehydratedCacheMetadata = { ...otherProps };
    if (_cacheMetadata) response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
    return response;
  }

  private async _messageHandler(message: Data, { ws, ...rest }: ServerSocketRequestOptions): Promise<void> {
    try {
      const { context, subscriptionID, subscription } = JSON.parse(message as string);
      const subscribeResult = await this._client.request(subscription, rest, context);

      if (isAsyncIterable(subscribeResult)) {
        forAwaitEach(subscribeResult, ({ _cacheMetadata, ...otherProps }: MaybeRequestResult) => {
          if (ws.readyState === ws.OPEN) {
            const result: MaybeRequestResultWithDehydratedCacheMetadata = { ...otherProps };
            if (_cacheMetadata) result._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
            ws.send(JSON.stringify({ result, subscriptionID }));
          }
        });
      }
    } catch (error) {
      ws.send(error);
    }
  }

  private async _requestHandler(req: Request, res: Response, options: ServerRequestOptions): Promise<void> {
    try {
      const { batched, context, request } = req.body as RequestData;

      const result = batched
        ? await this._handleBatchRequest(request as PlainObjectStringMap, options, context)
        : await this._handleRequest(request as string, options, context);

      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
