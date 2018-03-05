import { NextFunction, Request, RequestHandler, Response } from "express";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { isPlainObject } from "lodash";
import * as WebSocket from "ws";

import {
  DehydratedRequestResultDataObjectMap,
  MessageHandler,
  ServerArgs,
  ServerRequestOptions,
} from "./types";

import { DefaultClient } from "../default-client";
import { DehydratedRequestResultData, RequestResultData, StringObjectMap } from "../types";

let instance: ServerClient;

export class ServerClient {
  public static async create(args: ServerArgs): Promise<ServerClient> {
    if (instance && isPlainObject(args) && !args.newInstance) return instance;

    try {
      const server = new ServerClient();
      await server._createClient(args);
      instance = server;
      return instance;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _client: DefaultClient;

  get client(): DefaultClient {
    return this._client;
  }

  public request(opts?: ServerRequestOptions): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      this._requestHandler(req, res, opts);
    };
  }

  public message(ws: WebSocket, opts?: ServerRequestOptions): MessageHandler {
    return (message: string): void => {
      this._messageHandler(ws, message, opts);
    };
  }

  private async _createClient(args: ServerArgs): Promise<void> {
    this._client = await DefaultClient.create({ ...args, mode: "server" });
  }

  private async _messageHandler(ws: WebSocket, message: string, opts: ServerRequestOptions = {}): Promise<void> {
    try {
      const { subscriptionID, subscription } = JSON.parse(message as string);
      const subscribeResult = await this._client.request(subscription, opts);

      if (isAsyncIterable(subscribeResult)) {
        forAwaitEach(subscribeResult, (result: RequestResultData) => {
          if (ws.readyState === ws.OPEN) {
            const dehydratedResult = {
              ...result,
              cacheMetadata: DefaultClient.dehydrateCacheMetadata(result.cacheMetadata),
            };

            ws.send(JSON.stringify({ result: dehydratedResult, subscriptionID }));
          }
        });
      } else if (ws.readyState === ws.OPEN) {
        const result = subscribeResult as RequestResultData;

        const dehydratedResult = {
          ...result,
          cacheMetadata: DefaultClient.dehydrateCacheMetadata(result.cacheMetadata),
        };

        ws.send(JSON.stringify({ result: dehydratedResult, subscriptionID }));
      }
    } catch (error) {
      ws.send(error);
    }
  }

  private async _requestHandler(
    req: Request,
    res: Response,
    opts: ServerRequestOptions = {},
  ): Promise<void> {
    try {
      const { batched, query } = req.body;
      let dehydratedResult: DehydratedRequestResultData | DehydratedRequestResultDataObjectMap;

      if (batched) {
        const requests = query as StringObjectMap;
        const responses: DehydratedRequestResultDataObjectMap = {};

        await Promise.all(Object.keys(requests).map(async (requestHash) => {
          const request = requests[requestHash];
          const result = await this._client.request(request, opts) as RequestResultData;

          responses[requestHash] = {
            ...result,
            cacheMetadata: DefaultClient.dehydrateCacheMetadata(result.cacheMetadata),
          };
        }));

        dehydratedResult = responses;
      } else {
        const result = await this._client.request(query, opts) as RequestResultData;

        dehydratedResult = {
          ...result,
          cacheMetadata: DefaultClient.dehydrateCacheMetadata(result.cacheMetadata),
        };
      }

      res.status(200).send(dehydratedResult);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}
