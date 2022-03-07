import WorkerCachemap from "@cachemap/core-worker";
import Client from "@graphql-box/client";
import { MaybeRequestResult, MaybeRequestResultWithDehydratedCacheMetadata, RequestOptions } from "@graphql-box/core";
import { DebugManagerInit } from "@graphql-box/debug-manager";

export interface UserOptions {
  /**
   * The cache.
   */
  cache: WorkerCachemap;

  /**
   * The curried function to initialize the debug manager.
   */
  debugManager?: DebugManagerInit;

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
  result: MaybeRequestResultWithDehydratedCacheMetadata;
  type: "graphqlBox" | "cachemap";
}

export interface MessageContext {
  boxID: string;
  hasDeferOrStream: boolean;
}

export interface RegisterWorkerOptions {
  client: Client;
}
