import * as WS from "ws";
import { DehydratedRequestResultData } from "../types";

export interface DehydratedRequestResultDataObjectMap {
  [key: string]: DehydratedRequestResultData;
}

export type MessageHandler = (message: string) => void;

export interface ServerArgs {
  cachemapOptions?: CachemapOptionsGroup;
  defaultCacheControls?: DefaultCacheControls;
  fieldResolver?: GraphQLFieldResolver<any, any>;
  newInstance?: boolean;
  resourceKey?: string;
  rootValue?: any;
  schema?: GraphQLSchema;
  subscribeFieldResolver?: GraphQLFieldResolver<any, any>;
}

export interface ServerRequestOptions {
  awaitDataCached?: boolean;
  contextValue?: any;
  fieldResolver?: GraphQLFieldResolver<any, any>;
  forceFetch?: boolean;
  fragments?: string[];
  operationName?: string;
  rootValue?: any;
  subscribeFieldResolver?: GraphQLFieldResolver<any, any>;
  tag?: any;
  variables?: ObjectMap;
}
