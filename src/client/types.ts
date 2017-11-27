import {
  ExecutionArgs,
  ExecutionResult,
  GraphQLFieldResolver,
  GraphQLSchema,
  IntrospectionQuery,
} from "graphql";

import { ObjectMap } from "../types";

export interface CachemapOptions {
  objects?: any; // TODO: Replace with CachemapArgs interface
  responses?: any; // TODO: Replace with CachemapArgs interface
}

export interface DefaultCacheControls {
  mutation: string;
  query: string;
}

export type GraphQLExecution = (args: ExecutionArgs) => Promise<ExecutionResult>;

export interface ClientArgs {
  cachemapOptions?: CachemapOptions;
  defaultCacheControls?: DefaultCacheControls;
  executor?: GraphQLExecution;
  fieldResolver?: GraphQLFieldResolver<any, any>;
  headers?: ObjectMap;
  introspection?: IntrospectionQuery;
  mode: "internal" | "external";
  newInstance?: boolean;
  resourceKey?: string;
  rootValue?: any;
  schema?: GraphQLSchema;
  url?: string;
}

export interface ClientRequests {
  active: Map<string, string>;
  pending: Map<string, Array<{ resolve: (value: any) => void }>>;
}

export interface RequestOptions {
  forceFetch?: boolean;
  fragments?: string[];
  variables?: ObjectMap;
}

export interface RequestResults {

}
