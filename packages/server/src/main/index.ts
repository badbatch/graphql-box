import Client from "@graphql-box/client";
import {
  MaybeRequestContext,
  MaybeRequestResult,
  MaybeRequestResultWithDehydratedCacheMetadata,
  ServerRequestOptions,
  ServerSocketRequestOptions,
} from "@graphql-box/core";
import { dehydrateCacheMetadata } from "@graphql-box/helpers";
import { Request, Response } from "express-serve-static-core";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { castArray, isPlainObject } from "lodash";
import { Data } from "ws";
import {
  MessageHandler,
  RequestData,
  RequestHandler,
  ResponseDataWithMaybeDehydratedCacheMetadataBatch,
  UserOptions,
} from "../defs";
import writeResponseChunk from "../helpers/writeResponseChunk";

export default class Server {
  private _client: Client;
  private _requestTimeout: number;
  private _requestWhitelist: string[];

  constructor(options: UserOptions) {
    const errors: TypeError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@graphql-box/server expected options to ba a plain object."));
    }

    if (!options.client) {
      errors.push(new TypeError("@graphql-box/server expected options.client."));
    }

    if (errors.length) {
      throw errors;
    }

    this._client = options.client;
    this._requestTimeout = options.requestTimeout ?? 10000;
    this._requestWhitelist = options.requestWhitelist ?? [];
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
    requests: Record<string, { request: string; whitelistHash: string }>,
    options: ServerRequestOptions,
    context: MaybeRequestContext,
  ) {
    const responses: ResponseDataWithMaybeDehydratedCacheMetadataBatch = { batch: {} };

    await Promise.all(
      Object.keys(requests).map(async requestHash => {
        const { request, whitelistHash } = requests[requestHash];

        if (this._requestWhitelist.length && !this._requestWhitelist.includes(whitelistHash)) {
          responses.batch[requestHash] = {
            errors: [new Error("The request is not whitelisted.")],
            requestID: context.boxID as string,
          };

          return;
        }

        try {
          const requestTimer = setTimeout(() => {
            throw new Error(`@graphql-box/server did not process the request within ${this._requestTimeout}ms.`);
          }, this._requestTimeout);

          const { _cacheMetadata, ...otherProps } = (await this._client.request(
            request,
            options,
            context,
          )) as MaybeRequestResult;

          clearTimeout(requestTimer);
          responses.batch[requestHash] = { ...otherProps };

          if (_cacheMetadata) {
            responses.batch[requestHash]._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
          }
        } catch (error) {
          responses.batch[requestHash] = {
            errors: [error],
            requestID: context.boxID as string,
          };
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
    if (this._requestWhitelist.length && !this._requestWhitelist.includes(context.whitelistHash as string)) {
      res.status(400).send({ errors: [new Error("The request is not whitelisted.")] });
      return;
    }

    const requestTimer = setTimeout(() => {
      throw new Error(`@graphql-box/server did not process the request within ${this._requestTimeout}ms.`);
    }, this._requestTimeout);

    const requestResult = await this._client.request(request, options, context);
    clearTimeout(requestTimer);

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

      if (!otherProps.hasNext) {
        res.write("\r\n-----\r\n");
        res.end();
      }
    });
  }

  private async _messageHandler(message: Data, { ws, ...rest }: ServerSocketRequestOptions): Promise<void> {
    try {
      const { context = {}, subscriptionID, subscription } = JSON.parse(message as string);

      const requestTimer = setTimeout(() => {
        throw new Error(`@graphql-box/server did not process the request within ${this._requestTimeout}ms.`);
      }, this._requestTimeout);

      const subscribeResult = await this._client.subscribe(subscription, rest, context);
      clearTimeout(requestTimer);

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
      ws.send({ errors: castArray(error) });
    }
  }

  private _requestHandler(req: Request, res: Response, options: ServerRequestOptions) {
    try {
      const { batched, context = {}, request } = req.body as RequestData;

      batched
        ? this._handleBatchRequest(
            res,
            request as Record<string, { request: string; whitelistHash: string }>,
            options,
            context,
          )
        : this._handleRequest(res, request as string, options, context);
    } catch (error) {
      res.status(500).send({ errors: castArray(error) });
    }
  }
}
