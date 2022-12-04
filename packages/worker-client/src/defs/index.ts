import WorkerCachemap from "@cachemap/core-worker";
import Client from "@graphql-box/client";
import {
  DebugManagerDef,
  IncrementalRequestResult,
  RequestOptions,
  RequestResult,
  SerializedIncrementalRequestResult,
  SerializedRequestResult,
} from "@graphql-box/core";

export interface UserOptions {
  /**
   * The cache.
   */
  cache: WorkerCachemap;

  /**
   * The debug manager.
   */
  debugManager?: DebugManagerDef;

  /**
   * Enable support for defer and stream directives.
   */
  experimentalDeferStreamSupport?: boolean;

  /**
   * The web worker instance.
   */
  worker: Worker;
}

export type MethodNames = "request" | "subscribe";

export type PendingResolver = (
  value: RequestResult | AsyncIterableIterator<IncrementalRequestResult | undefined>,
) => void;

export interface PendingData {
  resolve: PendingResolver;
}

export type PendingTracker = Map<string, PendingData>;

export interface MessageRequestPayload {
  context: MessageContext;
  method: MethodNames;
  options: RequestOptions;
  request: string;
  type: "graphqlBox" | "cachemap";
}

export interface MessageResponsePayload {
  context: MessageContext;
  method: MethodNames;
  result: SerializedRequestResult | SerializedIncrementalRequestResult;
  type: "graphqlBox" | "cachemap";
}

export interface MessageContext {
  hasDeferOrStream: boolean;
  requestID: string;
}

export interface RegisterWorkerOptions {
  client: Client;
}
