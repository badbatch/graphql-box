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
import { Request, Response } from "express-serve-static-core";
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
import writeResponseChunk from "../helpers/writeResponseChunk";

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

  public message(options: ServerSocketRequestOptions): MessageHandler {
    return (message: Data) => {
      this._messageHandler(message, options);
    };
  }

  public request(options: ServerRequestOptions = {}): RequestHandler {
    return (req: Request, res: Response) => {
      this._requestHandler(req, res, options);
    };
  }

  private async _handleBatchRequest(
    res: Response,
    requests: PlainObjectStringMap,
    options: ServerRequestOptions,
    context: MaybeRequestContext,
  ) {
    const responses: ResponseDataWithMaybeDehydratedCacheMetadataBatch = { batch: {} };

    await Promise.all(
      Object.keys(requests).map(async requestHash => {
        const request = requests[requestHash];

        const { _cacheMetadata, ...otherProps } = (await this._client.request(
          request,
          options,
          context,
        )) as MaybeRequestResult;

        responses.batch[requestHash] = { ...otherProps };

        if (_cacheMetadata) {
          responses.batch[requestHash]._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        }
      }),
    );

    res.status(200).send(responses);
  }

  private async _handleRequest(
    res: Response,
    request: string,
    options: ServerRequestOptions,
    context: MaybeRequestContext,
  ) {
    const requestResult = await this._client.request(request, options, context);

    if (!isAsyncIterable(requestResult)) {
      const { _cacheMetadata, ...otherProps } = requestResult as MaybeRequestResult;
      const response: MaybeRequestResultWithDehydratedCacheMetadata = { ...otherProps };

      if (_cacheMetadata) {
        response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
      }

      res.status(200).send(response);
      return;
    }

    res.setHeader("Content-Type", 'multipart/mixed; boundary="-"');

    forAwaitEach(requestResult, ({ _cacheMetadata, ...otherProps }: MaybeRequestResult) => {
      const response: MaybeRequestResultWithDehydratedCacheMetadata = { ...otherProps };

      if (_cacheMetadata) {
        response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
      }

      writeResponseChunk(res, response);
    });

    res.write("\r\n-----\r\n");
    res.end();
  }

  private async _messageHandler(message: Data, { ws, ...rest }: ServerSocketRequestOptions): Promise<void> {
    try {
      const { context, subscriptionID, subscription } = JSON.parse(message as string);
      const subscribeResult = await this._client.subscribe(subscription, rest, context);

      if (isAsyncIterable(subscribeResult)) {
        forAwaitEach(subscribeResult, ({ _cacheMetadata, ...otherProps }: MaybeRequestResult) => {
          if (ws.readyState === ws.OPEN) {
            const result: MaybeRequestResultWithDehydratedCacheMetadata = { ...otherProps };

            if (_cacheMetadata) {
              result._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
            }

            ws.send(JSON.stringify({ result, subscriptionID }));
          }
        });

        return;
      }

      ws.send(subscribeResult);
    } catch (error) {
      ws.send(error);
    }
  }

  private _requestHandler(req: Request, res: Response, options: ServerRequestOptions) {
    try {
      const { batched, context, request } = req.body as RequestData;

      batched
        ? this._handleBatchRequest(res, request as PlainObjectStringMap, options, context)
        : this._handleRequest(res, request as string, options, context);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
