import Client from "@graphql-box/client";
import {
  LogLevel,
  MaybeRequestContext,
  MaybeRequestResultWithDehydratedCacheMetadata,
  PlainObjectMap,
} from "@graphql-box/core";
import { Request, Response } from "express-serve-static-core";
import { Data } from "ws";

export interface UserOptions {
  /**
   * The client.
   */
  client: Client;

  /**
   * Time the server has to process a request before timing out.
   */
  requestTimeout?: number;

  /**
   * List of request hashes that the server is allowed to
   * operate on.
   */
  requestWhitelist?: string[];
}

export type RequestHandler = (req: Request, res: Response, ...args: any[]) => void;

export type MessageHandler = (message: Data) => void;

export interface LogData {
  data: PlainObjectMap;
  logLevel?: LogLevel;
  message: string;
}

export interface RequestData {
  batched: boolean;
  context: MaybeRequestContext;
  request: string;
}

export interface BatchRequestData {
  batched: boolean;
  requests: Record<
    string,
    {
      context: MaybeRequestContext;
      request: string;
    }
  >;
}

export interface ResponseDataWithMaybeDehydratedCacheMetadataBatch {
  responses: {
    [key: string]: MaybeRequestResultWithDehydratedCacheMetadata;
  };
}
