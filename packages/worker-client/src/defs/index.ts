import WorkerCachemap from "@cachemap/core-worker";
import Client from "@graphql-box/client";
import { DebugManagerDef, MaybeRawFetchData, MaybeRequestResult, RequestOptions } from "@graphql-box/core";

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
   * The web worker instance.
   */
  worker: Worker;
}

export type MethodNames = "request" | "subscribe";

export type PendingResolver = (value: MaybeRequestResult) => void;

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
  result: MaybeRawFetchData;
  type: "graphqlBox" | "cachemap";
}

export interface MessageContext {
  hasDeferOrStream: boolean;
  requestID: string;
}

export interface RegisterWorkerOptions {
  client: Client;
}
