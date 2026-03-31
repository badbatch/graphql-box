import {
  type OperationOptions,
  type PartialOperationContext,
  type PlainObject,
  type QueryResult,
} from '@graphql-box/core';
import { type QueryError } from '@graphql-box/helpers';
import { type ReactElement, type RefObject } from 'react';

export type ConnectionVariables = {
  after?: string;
  before?: string;
  first?: number;
  last?: number;
};

export type Connection<Item extends PlainObject> = {
  edges?: Edge<Item>[];
  pageInfo: PageInfo;
  totalCount: number;
};

export type ConnectionResponse<Item extends PlainObject> = Record<string, Connection<Item> | undefined>;

export type Edge<Item extends PlainObject> = {
  cursor: string;
  node: Item;
};

export type ListingsChildrenProps<Item extends PlainObject> = {
  hasNextPage: boolean;
  lastItemRef: RefObject<HTMLDivElement | null>;
  listings: Item[];
  loading: boolean;
};

export type ListingsProps<Item extends PlainObject> = {
  children: (props: ListingsChildrenProps<Item>) => ReactElement | null;
  componentName: string;
  debug?: boolean;
  intersectionRoot?: IntersectionObserverInit['root'];
  intersectionRootMargin?: IntersectionObserverInit['rootMargin'];
  intersectionThreshold?: IntersectionObserverInit['threshold'];
  query: string;
  renderError?: (errors: QueryError) => ReactElement;
  renderLoader?: () => ReactElement;
  requestPath: string;
  resultsPerRequest?: number;
} & OperationOptions;

export type ListingsPropsInternal<Item extends PlainObject> = {
  children: (props: ListingsChildrenProps<Item>) => ReactElement | null;
  componentName: string;
  debug?: boolean;
  execute: (options?: OperationOptions, context?: PartialOperationContext) => Promise<void>;
  intersectionRoot?: IntersectionObserverInit['root'];
  intersectionRootMargin?: IntersectionObserverInit['rootMargin'];
  intersectionThreshold?: IntersectionObserverInit['threshold'];
  loading: boolean;
  queryHash: string;
  renderLoader?: () => ReactElement;
  requestPath: string;
  result: QueryResult<ConnectionResponse<Item>> | undefined;
  resultsPerRequest?: number;
} & OperationOptions;

export type ListingsData<Item extends PlainObject> = {
  hasNextPage: boolean;
  listings: Map<string, ConnectionResponse<Item>>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
};
