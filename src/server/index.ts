import { NextFunction, Request, RequestHandler, Response } from "express";
import { isPlainObject } from "lodash";
import { DehydratedRequestResultDataObjectMap, ServerArgs, ServerRequestOptions } from "./types";
import { DefaultClient } from "../default-client";
import { DehydratedRequestResultData, RequestResultData, StringObjectMap } from "../types";

let instance: ServerHandl;

export class ServerHandl {
  public static async create(args: ServerArgs): Promise<ServerHandl> {
    if (instance && isPlainObject(args) && !args.newInstance) return instance;

    try {
      const server = new ServerHandl();
      await server._createClient(args);
      instance = server;
      return instance;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _client: DefaultClient;

  public router(opts?: ServerRequestOptions): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      this._requestHandler(req, res, opts);
    };
  }

  private async _createClient(args: ServerArgs): Promise<void> {
    this._client = await DefaultClient.create({ ...args, mode: "server" });
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
