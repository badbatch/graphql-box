import {
  DebugManagerDef,
  MaybeRequestResult,
  MaybeRequestResultWithDehydratedCacheMetadata,
  RequestContext,
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

export interface MessagePayload {
  context: RequestContext;
  method: MethodNames;
  options: RequestOptions;
  result: MaybeRequestResultWithDehydratedCacheMetadata;
}

export interface MessageContext {
  handlID: string;
}
