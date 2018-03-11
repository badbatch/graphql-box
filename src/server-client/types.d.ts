import { GraphQLFieldResolver, GraphQLSchema } from "graphql";
import * as WebSocket from "ws";

import {
  CachemapOptions,
  CachemapOptionsGroup,
  DefaultCacheControls,
  DehydratedRequestResultData,
} from "../types";

/** @hidden */
export interface DehydratedRequestResultDataObjectMap {
  [key: string]: DehydratedRequestResultData;
}

export type MessageHandler = (ws: WebSocket) => (message: string) => void;

export interface ServerArgs {
  cachemapOptions?: CachemapOptionsGroup | CachemapOptions;
  defaultCacheControls?: DefaultCacheControls;
  fieldResolver?: GraphQLFieldResolver<any, any>;
  newInstance?: boolean;
  resourceKey?: string;
  rootValue?: any;
  schema?: GraphQLSchema;
  subscribeFieldResolver?: GraphQLFieldResolver<any, any>;
}

export interface ServerRequestOptions {
  contextValue?: any;
  fieldResolver?: GraphQLFieldResolver<any, any>;
  operationName?: string;
  rootValue?: any;
  subscribeFieldResolver?: GraphQLFieldResolver<any, any>;
  tag?: any;
}
