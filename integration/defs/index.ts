import { StoreInit } from "@cachemap/types";
import { PlainObjectStringMap, SubscriptionsManagerDef } from "@graphql-box/core";
import { GraphQLSchema, IntrospectionQuery } from "graphql";

export interface InitClientOptions {
  cachemapStore: StoreInit;
  debuggerName?: string;
  introspection?: IntrospectionQuery;
  schema?: GraphQLSchema;
  subscriptionsManager?: SubscriptionsManagerDef;
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
