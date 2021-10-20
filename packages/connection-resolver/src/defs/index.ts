import Cachemap from "@cachemap/core";
import { GraphQLResolveInfo } from "graphql";

export type PlainObject = {
  [key: string]: any;
};

export type Node = PlainObject & { id: string | number };

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

export interface ResourceResponse<Resource extends PlainObject> extends Response {
  data?: Resource;
  errors?: Error[];
}

export type ResourceResolver<Resource extends PlainObject> = (args: {
  page: number;
}) => Promise<ResourceResponse<Resource>>;

export type CreateResourceResolver<
  Source extends PlainObject,
  Args extends PlainObject,
  Ctx extends PlainObject,
  Resource extends PlainObject
> = (source: Source, args: Args, context: Ctx, info: GraphQLResolveInfo) => ResourceResolver<Resource>;

export interface Getters<Resource extends PlainObject, ResourceNode extends Node> {
  nodes: (obj: Resource) => ResourceNode[];
  page: (obj: Resource) => number;
  totalPages: (obj: Resource) => number;
  totalResults: (obj: Resource) => number;
}

export interface ConnectionResolverUserOptions<
  Source extends PlainObject,
  Args extends PlainObject,
  Ctx extends PlainObject,
  Resource extends PlainObject,
  ResourceNode extends Node
> {
  createMakeCursors: (
    source: Source,
    args: Args,
    context: Ctx,
    info: GraphQLResolveInfo,
  ) => {
    makeGroupCursor: () => string;
    makeIDCursor: (id: string | number) => string;
  };
  createResourceResolver: CreateResourceResolver<Source, Args, Ctx, Resource>;
  cursorCache: Cachemap;
  getters: Getters<Resource, ResourceNode>;
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
