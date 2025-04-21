import { type CoreWorker } from '@cachemap/core-worker';
import { type CacheManagerDef } from '@graphql-box/cache-manager';
import { type Client } from '@graphql-box/client';
import {
  type DebugManagerDef,
  type PartialRawFetchData,
  type PartialRequestResult,
  type RequestContext,
  type RequestData,
  type RequestOptions,
} from '@graphql-box/core';
import { type RequestParserDef } from '@graphql-box/request-parser';
import { type OperationTypeNode } from 'graphql';

export interface UserOptions {
  /**
   * The cache.
   */
  cache: CoreWorker;
  /**
   * The curried function to initialize the cache manager.
   */
  cacheManager: CacheManagerDef;
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
   * Must be passed in as true if you are going to
   * initialise the worker after the constructor.
   */
  lazyWorkerInit?: boolean;
  /**
   * The curried function to initialzie the request parser.
   */
  requestParser: RequestParserDef;
  /**
   * The web worker instance.
   */
  worker?: Worker | (() => Worker | Promise<Worker>);
}

export type MethodNames = 'request' | 'subscribe';

export type PendingResolver = (
  value: PartialRequestResult | AsyncIterableIterator<PartialRequestResult | undefined>,
) => void;

export interface PendingData {
  context?: RequestContext;
  options?: RequestOptions;
  requestData?: RequestData;
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
  initiator?: string;
  operation: OperationTypeNode;
  requestID: string;
}

export interface RegisterWorkerOptions {
  client: Client;
}
