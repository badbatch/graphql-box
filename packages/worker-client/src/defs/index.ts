import Client from "@handl/client";
import {
  DebugManagerDef,
  MaybeRequestResult,
  MaybeRequestResultWithDehydratedCacheMetadata,
  RequestOptions,
} from "@handl/core";
import { DebugManagerInit } from "@handl/debug-manager";

export interface UserOptions {
  /**
   * The curried function to initialize the debug manager.
   */
  debugManager?: DebugManagerInit;

  /**
   * The web worker instance.
   */
  worker: Worker;
}

export interface ConstructorOptions {
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
  type: "handl" | "cachemap";
}

export interface MessageResponsePayload {
  context: MessageContext;
  method: MethodNames;
  result: MaybeRequestResultWithDehydratedCacheMetadata;
  type: "handl" | "cachemap";
}

export interface MessageContext {
  handlID: string;
}

export interface RegisterWorkerOptions {
  client: Client;
}
