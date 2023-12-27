import { type StoreInit } from '@cachemap/types';
import { type GraphQLSchema, type IntrospectionQuery } from 'graphql';
import { type SubscriptionsManagerDef } from '@graphql-box/core';

export interface InitClientOptions {
  cachemapStore: StoreInit;
  debuggerName?: string;
  introspection?: IntrospectionQuery;
  schema?: GraphQLSchema;
  subscriptionsManager?: SubscriptionsManagerDef;
  typeCacheDirectives: Record<string, string>;
}

export interface InitWorkerClientOptions {
  worker: Worker;
}

export interface InitServerOptions {
  cachemapStore: StoreInit;
  debuggerName?: string;
  typeCacheDirectives: Record<string, string>;
}
