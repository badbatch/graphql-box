import { type PlainObject, type ResponseData, type SerialisedResponseData } from '@graphql-box/core';

export interface UserOptions {
  /**
   * The endpoint that client will use to communicate with the
   * GraphQL server for queries and mutations.
   */
  apiUrl: string;
  /**
   * Whether a client should batch requests query and mutation
   * requests.
   */
  batchRequests?: boolean;
  /**
   * How long client should wait for a server to
   * respond before timing out.
   */
  fetchTimeout?: number;
  /**
   * Additional headers to be sent with every request.
   */
  headers?: Record<string, string>;
  /**
   * The endpoint that client will use to send logs
   * to the server.
   */
  logUrl?: string;
  /**
   * How long client should wait to batch requests
   * before making a request.
   */
  requestBatchInterval?: number;
  /**
   * The maximum number of requests in a single batch
   */
  requestBatchMax?: number;
}

export type ActiveBatch = Map<string, ActiveBatchValue>;

export interface ActiveBatchValue {
  actions: BatchResultActions | undefined;
  body: PlainObject;
}

export interface BatchResultActions {
  reject: (reason: unknown) => void;
  resolve: (value: ResponseData) => void;
}

export type BatchActionsObjectMap = Record<string, BatchResultActions>;

export type SerialisedResponseDataObjectMap = Record<string, SerialisedResponseData>;

export interface BatchedSerialisedResponseData {
  responses: SerialisedResponseDataObjectMap;
}
