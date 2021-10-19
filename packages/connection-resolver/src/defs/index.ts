import Cachemap from "@cachemap/core";
import { GraphQLResolveInfo } from "graphql";

export type PlainObject = {
  [key: string]: any;
};

export type Node = PlainObject & { id: string };

export type Direction = "backward" | "forward";

export type CursorCacheEntry = {
  group: string;
  index: number;
  node: Node;
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
  node: Node;
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
  nodes: Node[];
  pageInfo: PageInfo;
  totalCount: number;
};

export interface ResourceResponse extends Response {
  data?: PlainObject;
  errors?: Error[];
}

export type ResourceResolver = (args: { page: number }) => Promise<ResourceResponse>;

export type CreateResourceResolver<Src = PlainObject, Args = PlainObject, Cxt = PlainObject> = (
  source: PlainObject & Src,
  args: PlainObject & Args,
  context: PlainObject & Cxt,
  info: GraphQLResolveInfo,
) => ResourceResolver;

export interface Getters {
  nodes: (obj: PlainObject) => Node[];
  page: (obj: PlainObject) => number;
  totalPages: (obj: PlainObject) => number;
  totalResults: (obj: PlainObject) => number;
}

export interface ConnectionResolverUserOptions {
  createMakeCursors: (
    source: PlainObject,
    args: PlainObject,
    context: PlainObject,
    info: GraphQLResolveInfo,
  ) => {
    makeGroupCursor: () => string;
    makeIDCursor: (id: string | number) => string;
  };
  createResourceResolver: CreateResourceResolver;
  cursorCache: Cachemap;
  getters: Getters;
  resolver?: (args: Connection) => Connection;
  resultsPerPage: number;
}

export type ConnectionResolver = (
  source: PlainObject,
  args: PlainObject & ConnectionInputOptions,
  context: PlainObject,
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
