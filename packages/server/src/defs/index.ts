import Client from "@handl/client";
import {
  MaybeRequestContext,
  MaybeRequestResultWithDehydratedCacheMetadata,
  PlainObjectStringMap,
} from "@handl/core";
import { Request, Response } from "express";
import { Data } from "ws";

export interface UserOptions {
  /**
   * The client.
   */
  client: Client;
}

export type ConstructorOptions = UserOptions;

export type RequestHandler = (req: Request, res: Response, ...args: any[]) => void;

export type MessageHandler = (message: Data) => void;

export interface RequestData {
  batched: boolean;
  context: MaybeRequestContext;
  request: string | PlainObjectStringMap;
}

export interface ResponseDataWithMaybeDehydratedCacheMetadataBatch {
  [key: string]: MaybeRequestResultWithDehydratedCacheMetadata;
}
