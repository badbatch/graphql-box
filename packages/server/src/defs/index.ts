import Client from "@handl/client";
import { MaybeRequestResultWithDehydratedCacheMetadata, PlainObjectStringMap } from "@handl/core";
import { Request, Response } from "express";
import WebSocket from "ws";

export interface UserOptions {
  /**
   * The client.
   */
  client: Client;
}

export type ConstructorOptions = UserOptions;

export interface RequestOptions {
  /**
   * Whether the request method should wait until
   * all response data has been cached before
   * returning the response data.
   */
  awaitDataCaching?: boolean;

  /**
   * Whether to return the cache metadata along
   * with the requested data.
   */
  returnCacheMetadata?: boolean;

  /**
   * An identifier that will be stored in a request's cache metadata.
   * This can be used to retrieve cache entries against.
   */
  tag?: any;
}

export type RequestHandler = (req: Request, res: Response, ...args: any[]) => void;

export type MessageHandler = (ws: WebSocket) => (message: string) => void;

export interface RequestData {
  batched: boolean;
  request: string | PlainObjectStringMap;
}

export interface ResponseDataWithMaybeDehydratedCacheMetadataBatch {
  [key: string]: MaybeRequestResultWithDehydratedCacheMetadata;
}
