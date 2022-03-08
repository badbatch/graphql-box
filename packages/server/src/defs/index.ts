import Client from "@graphql-box/client";
import { MaybeRequestContext, MaybeRequestResultWithDehydratedCacheMetadata } from "@graphql-box/core";
import { Request, Response } from "express-serve-static-core";
import { Data } from "ws";

export interface UserOptions {
  /**
   * The client.
   */
  client: Client;

  /**
   * List of request hashes that the server is allowed to
   * operate on.
   */
  requestWhitelist?: string[];
}

export type RequestHandler = (req: Request, res: Response, ...args: any[]) => void;

export type MessageHandler = (message: Data) => void;

export interface RequestData {
  batched: boolean;
  context: MaybeRequestContext;
  request: string | Record<string, { request: string; whitelistHash: string }>;
}

export interface ResponseDataWithMaybeDehydratedCacheMetadataBatch {
  batch: {
    [key: string]: MaybeRequestResultWithDehydratedCacheMetadata;
  };
}
