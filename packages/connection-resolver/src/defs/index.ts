import Cachemap from "@cachemap/core";
import { GraphQLResolveInfo } from "graphql";

export type Direction = "backward" | "forward";

export type CursorCacheEntry = {
  group: string;
  index: number;
  node: Record<string, any>;
  page: number;
};

export type CursorGroupMetadata = {
  totalPages: number;
  totalResults: number;
};

export type CachedEdges = {
  edges: Edge[];
  pageNumber: number;
};

export type Edge = {
  cursor: string;
  node: Record<string, any>;
};

export type Indexes = {
  absolute: number;
  relative: number;
};

export type PageInfo = {
  endCursor?: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
};

export type Connection = {
  edges: Edge[];
  errors: Error[];
  nodes: Record<string, any>[];
  pageInfo: PageInfo;
  totalCount: number;
};

export interface ResourceResponse extends Response {
  data?: Record<string, any>;
  errors?: Error[];
}

export type ResourceResolver = (args: { page: number }) => Promise<ResourceResponse>;

export type CreateResourceResolver = (
  source: Record<string, any>,
  args: Record<string, any>,
  context: Record<string, any>,
  info: GraphQLResolveInfo,
) => ResourceResolver;

export type Node = Record<string, any> & { id: string | number };

export interface Getters {
  nodes: (obj: Record<string, any>) => Node[];
  page: (obj: Record<string, any>) => number;
  totalPages: (obj: Record<string, any>) => number;
  totalResults: (obj: Record<string, any>) => number;
}

export interface ConnectionAdapterUserOptions {
  createMakeCursors: (
    source: Record<string, any>,
    args: Record<string, any>,
    context: Record<string, any>,
    info: GraphQLResolveInfo,
  ) => {
    makeGroupCursor: () => string;
    makeIDCursor: (id: string | number) => string;
  };
  createResourceResolver: CreateResourceResolver;
  cursorCache: Cachemap;
  getters: Getters;
  resolver: (args: Connection) => Connection;
  resultsPerPage: number;
}

export type ConnectionResolver = (
  source: Record<string, any>,
  args: Record<string, any> & ConnectionInputOptions,
  context: Record<string, any>,
  info: GraphQLResolveInfo,
) => Promise<Connection>;

export type ConnectionInputOptions = {
  after?: string;
  before?: string;
  first?: number;
  last?: number;
};

export type Context = {
  entry: CursorCacheEntry;
  metadata: CursorGroupMetadata;
  resultsPerPage: number;
};
