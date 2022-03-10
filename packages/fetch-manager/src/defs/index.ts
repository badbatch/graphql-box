import { MaybeRawFetchData, MaybeRawResponseData, PlainObjectStringMap } from "@graphql-box/core";

export interface UserOptions {
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
   * How long client should wait to batch requests
   * before making a request.
   */
  requestBatchInterval?: number;

  /**
   * How long client should wait to batch responses
   * before returning a response.
   */
  responseBatchInterval?: number;

  /**
   * The endpoint that client will use to communicate with the
   * GraphQL server for queries and mutations.
   */
  url: string;
}

export type ConstructorOptions = UserOptions;

export interface FetchOptions {
  batch: boolean;
}

export type ActiveBatch = Map<string, ActiveBatchValue>;

export interface ActiveBatchValue {
  actions: BatchResultActions;
  request: string;
  whitelistHash: string;
}

export interface BatchResultActions {
  reject: (reason: Error) => void;
  resolve: (value: MaybeRawResponseData) => void;
}

export interface BatchActionsObjectMap {
  [key: string]: BatchResultActions;
}

export interface MaybeRawFetchDataObjectMap {
  [key: string]: MaybeRawFetchData;
}

export interface BatchedMaybeFetchData {
  batch: MaybeRawFetchDataObjectMap;
  headers: Headers;
}
