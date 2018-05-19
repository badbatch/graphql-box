import { GraphQLFieldResolver, GraphQLSchema } from "graphql";
import * as WebSocket from "ws";
import { CachemapOptions, CachemapOptionsGroup, DehydratedRequestResultData } from "../types";

/** @hidden */
export interface DehydratedRequestResultDataObjectMap {
  [key: string]: DehydratedRequestResultData;
}

export type MessageHandler = (ws: WebSocket) => (message: string) => void;

export interface ServerArgs {
  /**
   * The configuration options to be passed through
   * to the `Cachemap` instances used for persisted
   * storage.
   *
   */
  cachemapOptions?: CachemapOptionsGroup | CachemapOptions;
  /**
   * Set default GraphQL field resolver function to
   * be passed on to GraphQL's execute and subscribe
   * methods.
   *
   */
  fieldResolver?: GraphQLFieldResolver<any, any>;
  /**
   * Whether to return a new instance of handl or the
   * existing instance, if one exists.
   *
   */
  newInstance?: boolean;
  /**
   * The name of the property thats value is used as the unique
   * identifier for each resource/entity in the GraphQL schema.
   *
   */
  resourceKey?: string;
  /**
   * Set default GraphQL root value to be passed on to
   * GraphQL's execute and subscribe methods.
   *
   */
  rootValue?: any;
  /**
   * The GraphQL schema to be passed on to
   * GraphQL's execute and subscribe methods.
   *
   */
  schema?: GraphQLSchema;
  /**
   * Set default GraphQL subscribe field resolver function to
   * be passed on to GraphQL's subscribe method.
   *
   */
  subscribeFieldResolver?: GraphQLFieldResolver<any, any>;
  /**
   * An optional object map of GraphQL schema types to cache-control
   * directives used for caching object types. This offers a quick
   * way to implement type-level caching without having to
   * touch the underlying schema.
   *
   */
  typeCacheControls?: StringObjectMap;
}

export interface ServerRequestOptions {
  /**
   * Set GraphQL context value to be passed on to
   * GraphQL's execute and subscribe methods.
   *
   */
  contextValue?: any;
  /**
   * Set default GraphQL field resolver function to
   * be passed on to GraphQL's execute and subscribe
   * methods.
   *
   */
  fieldResolver?: GraphQLFieldResolver<any, any>;
  /**
   * Set GraphQL operation name to be passed on to
   * GraphQL's execute and subscribe methods.
   *
   */
  operationName?: string;
  /**
   * Set default GraphQL root value to be passed on to
   * GraphQL's execute and subscribe methods.
   *
   */
  rootValue?: any;
  /**
   * Set default GraphQL subscribe field resolver function to
   * be passed on to GraphQL's subscribe method.
   *
   */
  subscribeFieldResolver?: GraphQLFieldResolver<any, any>;
  /**
   * An identifier that will be stored in a request's cache metadata.
   * This can be used to retrieve cache entries against.
   *
   */
  tag?: any;
}
