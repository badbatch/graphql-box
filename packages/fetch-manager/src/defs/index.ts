import { PlainObjectStringMap, RequestManagerResult } from "@graphql-box/core";
import { JsonValue } from "type-fest";

export interface UserOptions {
  /**
   * The endpoint that client will use to communicate with the
   * GraphQL server for queries and mutations.
   */
  apiUrl?: string;

  /**
   * Whether a client should batch requests query and mutation
   * requests.
   */
  batchRequests?: boolean;

  /**
   * Whether a client should batch responses when receiving
   * patches for requests using defer or stream.
   */
  batchResponses?: boolean;

  /**
   * How long client should wait for a server to
   * respond before timing out.
   */
  fetchTimeout?: number;

  /**
   * Additional headers to be sent with every request.
   */
  headers?: PlainObjectStringMap;

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

  /**
   * How long client should wait to batch responses
   * before returning a response.
   */
  responseBatchInterval?: number;
}

export type ActiveBatch = Map<string, ActiveBatchValue>;

export interface ActiveBatchValue {
  actions: BatchResultActions | undefined;
  body: JsonValue;
}

export interface BatchResultActions {
  reject: (reason: Error) => void;
  resolve: (value: RequestManagerResult) => void;
}

export interface BatchActionsObjectMap {
  [key: string]: BatchResultActions;
}

export type Part<Body, Fallback> =
  | { body: Fallback; headers: Record<string, string>; json: false }
  | { body: Body; headers: Record<string, string>; json: true };
