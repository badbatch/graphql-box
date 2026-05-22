import { type Client } from '@graphql-box/client';
import {
  type GraphqlStep,
  type LogData,
  type LogLevel,
  type OperationContextData,
  type PlainArray,
  type SerialisedFetchResponseData,
} from '@graphql-box/core';
import { type Request, type Response } from 'express';
import { type TransformableInfo } from 'logform';
import { type NextRequest, type NextResponse } from 'next/server.js';

export interface UserOptions {
  /**
   * The client.
   */
  client: Client;

  /**
   * Set to true to return all server logs for an operation in
   * its response. The logs get returned on a `logs` property
   * in the extensions object.
   */
  getLogDump?: (operationId: string) => LogDump | undefined;

  /**
   * List of request hashes that the server is allowed to
   * operate on.
   */
  operationWhitelist?: string[];

  /**
   * Time the server has to process a request before timing out.
   */
  requestTimeout?: number;
}

export type LogDump = (Partial<TransformableInfo> | Partial<TransformableInfo>[])[];

export type ExpressRequestHandler = (req: Request, res: Response, ...args: PlainArray) => void;

export type NextRequestHandler = (req: NextRequest) => Promise<NextResponse>;

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

export type RequestData = {
  batched: boolean;
  context: {
    data: OperationContextData;
  };
  operation: string;
};

export type BatchRequestData = {
  batched: boolean;
  operations: Record<
    string,
    {
      context: {
        data: OperationContextData;
      };
      operation: string;
    }
  >;
};

export type SerialisedResponseDataBatch = {
  responses: Record<string, SerialisedFetchResponseData>;
};
