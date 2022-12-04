import Client from "@graphql-box/client";
import {
  CacheMetadata,
  IncrementalServerResponse,
  MaybeRequestContext,
  MaybeRequestResult,
  SERVER_REQUEST_RECEIVED,
  ServerRequestOptions,
  ServerResponse,
  ServerSocketRequestOptions,
} from "@graphql-box/core";
import { dehydrateCacheMetadata, serializeErrors } from "@graphql-box/helpers";
import { Request, Response } from "express-serve-static-core";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { castArray, isPlainObject } from "lodash";
import { Data } from "ws";
import {
  LogData,
  MessageHandler,
  RequestData,
  RequestHandler,
  ResponseDataWithMaybeDehydratedCacheMetadataBatch,
  UserOptions,
} from "../defs";
import isRequestBatched from "../helpers/isRequestBatched";
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

  public log(): RequestHandler {
    return (req: Request, res: Response) => {
      this._logHandler(req, res);
    };
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
    requests: Record<
      string,
      {
        context: MaybeRequestContext;
        request: string;
      }
    >,
    options: ServerRequestOptions,
  ) {
    const response: ResponseDataWithMaybeDehydratedCacheMetadataBatch = { responses: {} };

    await Promise.all(
      Object.keys(requests).map(async requestHash => {
        const { request, context } = requests[requestHash];

        if (
          this._requestWhitelist.length &&
          context.whitelistHash &&
          !this._requestWhitelist.includes(context.whitelistHash)
        ) {
          response.responses[requestHash] = serializeErrors({
            errors: [new Error("@graphql-box/server: The request is not whitelisted.")],
            requestID: context.requestID as string,
          });

          return;
        }

        try {
          const requestTimer = setTimeout(() => {
            response.responses[requestHash] = serializeErrors({
              errors: [new Error(`@graphql-box/server did not process the request within ${this._requestTimeout}ms.`)],
              requestID: context.requestID as string,
            });
          }, this._requestTimeout);

          const { _cacheMetadata, ...otherProps } = (await this._client.request(
            request,
            options,
            context,
          )) as MaybeRequestResult;

          clearTimeout(requestTimer);
          response.responses[requestHash] = serializeErrors({ ...otherProps });

          if (_cacheMetadata) {
            response.responses[requestHash]._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
          }
        } catch (error) {
          response.responses[requestHash] = serializeErrors({
            errors: castArray(error),
            requestID: context.requestID as string,
          });
        }
      }),
    );

    res.status(200).send(response);
  }

  private _handleLogs(logs: LogData[]) {
    logs.forEach(({ data, logLevel, message }) => {
      this._client?.debugger?.handleLog(message, data, logLevel);
    });
  }

  private async _handleRequest(
    res: Response,
    request: string,
    options: ServerRequestOptions,
    context: MaybeRequestContext,
  ) {
    if (this._requestWhitelist.length && !this._requestWhitelist.includes(context.whitelistHash as string)) {
      res.status(400).send(serializeErrors({ errors: [new Error("The request is not whitelisted.")] }));
      return;
    }

    const requestTimer = setTimeout(() => {
      res.status(408).send(
        serializeErrors({
          errors: [new Error(`@graphql-box/server did not process the request within ${this._requestTimeout}ms.`)],
        }),
      );
    }, this._requestTimeout);

    const requestResult = await this._client.request(request, options, context);
    clearTimeout(requestTimer);

    if (!isAsyncIterable(requestResult)) {
      const { requestID, ...rest } = requestResult;

      const serverResult =
        "_cacheMetadata" in rest
          ? { ...rest, _cacheMetadata: dehydrateCacheMetadata(rest._cacheMetadata as CacheMetadata) }
          : (rest as ServerResponse);

      res.status(200).send(serializeErrors(serverResult));
      return;
    }

    res.setHeader("Content-Type", 'multipart/mixed; boundary="-"');

    forAwaitEach(requestResult, result => {
      if (!result) {
        return;
      }

      const { requestID, ...rest } = result;

      const serverResult =
        "_cacheMetadata" in rest
          ? { ...rest, _cacheMetadata: dehydrateCacheMetadata(rest._cacheMetadata as CacheMetadata) }
          : (rest as IncrementalServerResponse);

      writeResponseChunk(res, "errors" in serverResult ? serializeErrors(serverResult) : serverResult);

      if ("hasNext" in result && !result.hasNext) {
        res.write("\r\n-----\r\n");
        res.end();
      }
    });
  }

  private _logHandler(req: Request, res: Response) {
    try {
      let logs: LogData[] = [];
      const { body } = req;

      if (body.batched) {
        logs = Object.values(body.requests);
      } else {
        const { batched, ...rest } = body;
        logs = [rest];
      }

      this._handleLogs(logs);
      res.status(204).send();
    } catch (error) {
      res.status(500).send(serializeErrors({ errors: castArray(error) }));
    }
  }

  private async _messageHandler(message: Data, { ws, ...options }: ServerSocketRequestOptions): Promise<void> {
    try {
      const { context = {}, subscriptionID, subscription } = JSON.parse(message as string);

      const requestTimer = setTimeout(() => {
        ws.send(
          serializeErrors({
            errors: [new Error(`@graphql-box/server did not process the request within ${this._requestTimeout}ms.`)],
          }),
        );
      }, this._requestTimeout);

      const subscribeResult = await this._client.subscribe(subscription, options, context);
      clearTimeout(requestTimer);

      if (!isAsyncIterable(subscribeResult)) {
        ws.send(serializeErrors(subscribeResult));
        return;
      }

      forAwaitEach(subscribeResult, result => {
        if (ws.readyState === ws.OPEN) {
          if (!result) {
            return;
          }

          const { requestID, ...rest } = result;

          const serverResult =
            "_cacheMetadata" in rest
              ? { ...rest, _cacheMetadata: dehydrateCacheMetadata(rest._cacheMetadata as CacheMetadata) }
              : (rest as ServerResponse);

          ws.send(JSON.stringify({ result: serializeErrors(serverResult), subscriptionID }));
        }
      });
    } catch (error) {
      ws.send(serializeErrors({ errors: castArray(error) }));
    }
  }

  private _requestHandler({ body, headers }: Request, res: Response, options: ServerRequestOptions) {
    try {
      if (isRequestBatched(body)) {
        const { requests } = body;

        (async () => {
          Object.values(requests).forEach(({ context, request }) => {
            this._client.debugger?.log(SERVER_REQUEST_RECEIVED, { body, context, headers, request });
          });
        })();

        this._handleBatchRequest(res, body.requests, options);
      } else {
        const { context, request } = body as RequestData;
        this._client.debugger?.log(SERVER_REQUEST_RECEIVED, { body, context, headers, request });
        this._handleRequest(res, body.request, options, body.context);
      }
    } catch (error) {
      res.status(500).send(serializeErrors({ errors: castArray(error) }));
    }
  }
}
