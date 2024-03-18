import { type Core } from '@cachemap/core';
import { type PlainObject } from '@graphql-box/core';
import { type GraphQLResolveInfo } from 'graphql';
import { type SetOptional } from 'type-fest';

export type Direction = 'backward' | 'forward';

export type CursorCacheEntry = {
  group: string;
  index: number;
  node: Node;
  page: number;
};

export type PartialCursorCacheEntry = SetOptional<CursorCacheEntry, 'group' | 'node'>;

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

export type Node = PlainObject & { id: string | number };

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
  Source extends PlainObject | undefined,
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
  Source extends PlainObject | undefined,
  Args extends PlainObject,
  Ctx extends PlainObject,
  Resource extends PlainObject,
  ResourceNode extends Node
> {
  createMakeCursors: (
    source: Source,
    args: Args,
    context: Ctx,
    info: GraphQLResolveInfo
  ) => {
    makeGroupCursor: () => string;
    makeIDCursor: (id: string | number) => string;
  };
  createResourceResolver: CreateResourceResolver<Source, Args, Ctx, Resource>;
  cursorCache: Core;
  getters: Getters<Resource, ResourceNode>;
  resolver?: (args: Connection) => Connection;
  resultsPerPage: number;
}

export type ConnectionResolver = (
  source: PlainObject,
  args: PlainObject & ConnectionInputOptions,
  context: PlainObject,
  info: GraphQLResolveInfo
) => Promise<Connection>;

export type ConnectionInputOptions = {
  after?: string;
  before?: string;
  first?: number;
  last?: number;
};
