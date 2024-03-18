import { type Client } from '@graphql-box/client';
import {
  type LogLevel,
  type PartialRawFetchData,
  type PlainArray,
  type PlainData,
  type RequestContext,
} from '@graphql-box/core';
import { type Request, type Response } from 'express';
import { type Data } from 'ws';

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

export type RequestHandler = (req: Request, res: Response, ...args: PlainArray) => void;

export type MessageHandler = (message: Data) => void;

export type LogData = {
  batched: boolean;
  data: PlainData;
  logLevel?: LogLevel;
  message: string;
};

export type BatchedLogData = {
  batched: boolean;
  requests: Record<
    string,
    {
      data: PlainData;
      logLevel?: LogLevel;
      message: string;
    }
  >;
};

export type MessageData = {
  context: Pick<RequestContext, 'operation' | 'originalRequestHash' | 'requestID'>;
  subscription: string;
  subscriptionID: string;
};

export type RequestData = {
  batched: boolean;
  context: Pick<RequestContext, 'operation' | 'originalRequestHash' | 'requestID'>;
  request: string;
};

export type BatchRequestData = {
  batched: boolean;
  requests: Record<
    string,
    {
      context: Pick<RequestContext, 'operation' | 'originalRequestHash' | 'requestID'>;
      request: string;
    }
  >;
};

export type ResponseDataWithMaybeDehydratedCacheMetadataBatch = {
  responses: Record<string, PartialRawFetchData>;
};
