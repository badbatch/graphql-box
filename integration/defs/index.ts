import { StoreInit } from "@cachemap/core";
import { PlainObjectStringMap, SubscriptionsManagerInit } from "@graphql-box/core";
import { GraphQLSchema, IntrospectionQuery } from "graphql";

export interface InitClientOptions {
  cachemapStore: StoreInit;
  debuggerName?: string;
  introspection?: IntrospectionQuery;
  schema?: GraphQLSchema;
  subscriptionsManager?: SubscriptionsManagerInit;
  typeCacheDirectives: PlainObjectStringMap;
}

export interface InitWorkerClientOptions {
  worker: Worker;
}

export interface InitServerOptions {
  cachemapStore: StoreInit;
  debuggerName?: string;
  typeCacheDirectives: PlainObjectStringMap;
}
