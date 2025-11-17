import { type CoreWorker } from '@cachemap/core-worker';
import { type CacheManagerDef } from '@graphql-box/cache-manager';
import { type Client } from '@graphql-box/client';
import {
  type DebugManagerDef,
  type OperationContext,
  type OperationContextData,
  type OperationData,
  type OperationOptions,
  type ResponseData,
  type SerialisedResponseData,
} from '@graphql-box/core';
import { type OperationParserDef } from '@graphql-box/operation-parser';

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
   * Must be passed in as true if you are going to
   * initialise the worker after the constructor.
   */
  lazyWorkerInit?: boolean;
  /**
   * The curried function to initialzie the request parser.
   */
  operationParser: OperationParserDef;
  /**
   * The web worker instance.
   */
  worker?: Worker | (() => Worker | Promise<Worker>);
}

export type PendingResolver = (value: ResponseData) => void;

export interface PendingData {
  context?: OperationContext;
  operationData?: OperationData;
  options?: OperationOptions;
  resolve: PendingResolver;
}

export type PendingTracker = Map<string, PendingData>;

export interface MessageRequestPayload {
  context: MessageContext;
  operation: string;
  options: OperationOptions;
  type: 'graphqlBox' | 'cachemap';
}

export interface MessageResponsePayload {
  context: MessageContext;
  result: SerialisedResponseData;
  type: 'graphqlBox' | 'cachemap';
}

export interface MessageContext {
  data: OperationContextData;
}

export interface RegisterWorkerOptions {
  client: Client;
}
