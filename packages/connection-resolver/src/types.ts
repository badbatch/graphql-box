import { type Core } from '@cachemap/core';
import { type PlainObject } from '@graphql-box/core';
import { type GraphQLResolveInfo, type OperationTypeNode } from 'graphql';
import { type SetOptional } from 'type-fest';
import { type Logger } from 'winston';

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

export type ResourceResponse<Resource extends PlainObject> = {
  data?: Resource;
  errors?: Error[];
  headers: Headers;
};

export type ResourceResolver<Resource extends PlainObject> = (args: {
  page: number;
}) => Promise<ResourceResponse<Resource>>;

export type SetCacheMetadata = (key: string, headers: Headers, operation?: OperationTypeNode) => void;

export type Context = PlainObject & {
  logger?: Logger;
  setCacheMetadata?: SetCacheMetadata;
};

export type CreateResourceResolver<
  Source extends PlainObject | undefined,
  Args extends PlainObject,
  Ctx extends Context,
  Resource extends PlainObject,
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
  Ctx extends Context,
  Resource extends PlainObject,
  ResourceNode extends Node,
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
  cursorCache: Core;
  getters: Getters<Resource, ResourceNode>;
  resolver?: (args: Connection) => Connection;
  resultsPerPage: number;
}

export type ConnectionResolver = (
  source: PlainObject,
  args: PlainObject & ConnectionInputOptions,
  context: Context,
  info: GraphQLResolveInfo,
) => Promise<Connection>;

export type ConnectionInputOptions = {
  after?: string;
  before?: string;
  first?: number;
  last?: number;
};
