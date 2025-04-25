import { type Client } from '@graphql-box/client';
import {
  type GraphqlStep,
  type LogData,
  type LogLevel,
  type PartialRawFetchData,
  type PlainArray,
  type RequestContextData,
} from '@graphql-box/core';
import { type Request, type Response } from 'express';
import { type NextRequest, type NextResponse } from 'next/server.js';
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

export type ExpressRequestHandler = (req: Request, res: Response, ...args: PlainArray) => void;

export type NextRequestHandler = (req: NextRequest) => Promise<NextResponse>;

export type WsMessageHandler = (message: Data) => void;

export type LogDataPayload = {
  batched: boolean;
  data: LogData;
  logLevel?: LogLevel;
  message: GraphqlStep;
};

export type BatchedLogDataPayload = {
  batched: boolean;
  requests: Record<
    string,
    {
      data: LogData;
      logLevel?: LogLevel;
      message: GraphqlStep;
    }
  >;
};

export type MessageData = {
  context: {
    data: RequestContextData;
  };
  subscription: string;
  subscriptionID: string;
};

export type RequestData = {
  batched: boolean;
  context: {
    data: RequestContextData;
  };
  request: string;
};

export type BatchRequestData = {
  batched: boolean;
  requests: Record<
    string,
    {
      context: {
        data: RequestContextData;
      };
      request: string;
    }
  >;
};

export type ResponseDataWithMaybeDehydratedCacheMetadataBatch = {
  responses: Record<string, PartialRawFetchData>;
};
