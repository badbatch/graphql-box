import { type CoreWorker } from '@cachemap/core-worker';
import { type Client } from '@graphql-box/client';
import {
  type DebugManagerDef,
  type PartialRawFetchData,
  type PartialRequestResult,
  type RequestOptions,
} from '@graphql-box/core';

export interface UserOptions {
  /**
   * The cache.
   */
  cache: CoreWorker;

  /**
   * The debug manager.
   */
  debugManager?: DebugManagerDef;

  /**
   * Enable support for defer and stream directives. Based on version
   * of spec in 16.1.0-experimental-stream-defer.6
   */
  experimentalDeferStreamSupport?: boolean;

  /**
   * The web worker instance.
   */
  worker: Worker | (() => Promise<Worker>);
}

export type MethodNames = 'request' | 'subscribe';

export type PendingResolver = (
  value: PartialRequestResult | AsyncIterableIterator<PartialRequestResult | undefined>,
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
  type: 'graphqlBox' | 'cachemap';
}

export interface MessageResponsePayload {
  context: MessageContext;
  method: MethodNames;
  result: PartialRawFetchData;
  type: 'graphqlBox' | 'cachemap';
}

export interface MessageContext {
  hasDeferOrStream: boolean;
  requestID: string;
}

export interface RegisterWorkerOptions {
  client: Client;
}
