import Client from "@handl/client";
import {
  MaybeRequestResult,
  MaybeRequestResultWithDehydratedCacheMetadata,
  PlainObjectStringMap,
} from "@handl/core";
import { dehydrateCacheMetadata } from "@handl/helpers";
import { Request, Response } from "express";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { isPlainObject } from "lodash";
import WebSocket from "ws";
import {
  ConstructorOptions,
  MessageHandler,
  RequestData,
  RequestHandler,
  RequestOptions,
  ResponseDataWithMaybeDehydratedCacheMetadataBatch,
  UserOptions,
} from "../defs";

export class Server {
  public static async init(options: UserOptions): Promise<Server> {
    const errors: TypeError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@handl/server expected options to ba a plain object."));
    }

    if (!options.client) {
      errors.push(new TypeError("@handl/server expected options.client."));
    }

    if (errors.length) return Promise.reject(errors);

    try {
      return new Server(options);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _client: Client;

  constructor(options: ConstructorOptions) {
    const { client } = options;
    this._client = client;
  }

  public request(options: RequestOptions = {}): RequestHandler {
    return (req: Request, res: Response) => {
      this._requestHandler(req, res, options);
    };
  }

  public message(options: RequestOptions = {}): MessageHandler {
    return (ws: WebSocket) => {
      return (message: string) => {
        this._messageHandler(ws, message, options);
      };
    };
  }

  private async _handleBatchRequest(
    requests: PlainObjectStringMap,
    { awaitDataCaching, returnCacheMetadata, tag }: RequestOptions,
  ): Promise<ResponseDataWithMaybeDehydratedCacheMetadataBatch> {
    const responses: ResponseDataWithMaybeDehydratedCacheMetadataBatch = {};

    await Promise.all(Object.keys(requests).map(async (requestHash) => {
      const request = requests[requestHash];

      const { _cacheMetadata, ...otherProps } = await this._client.request(
        request,
        { awaitDataCaching, returnCacheMetadata, tag },
      );

      responses[requestHash] = { ...otherProps };
      if (_cacheMetadata) responses[requestHash]._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
    }));

    return responses;
  }

  private async _handleRequest(
    request: string,
    { awaitDataCaching, returnCacheMetadata, tag }: RequestOptions,
  ): Promise<MaybeRequestResultWithDehydratedCacheMetadata> {
    const { _cacheMetadata, ...otherProps } = await this._client.request(
      request,
      { awaitDataCaching, returnCacheMetadata, tag },
    );

    const response: MaybeRequestResultWithDehydratedCacheMetadata = { ...otherProps };
    if (_cacheMetadata) response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
    return response;
  }

  private async _messageHandler(ws: WebSocket, message: string, options: RequestOptions): Promise<void> {
    try {
      const { subscriptionID, subscription } = JSON.parse(message);
      const subscribeResult = await this._client.request(subscription, options);

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

  private async _requestHandler(req: Request, res: Response, options: RequestOptions): Promise<void> {
    try {
      const { batched, request } = req.body as RequestData;

      const result = batched
        ? await this._handleBatchRequest(request as PlainObjectStringMap, options)
        : await this._handleRequest(request as string, options);

      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
