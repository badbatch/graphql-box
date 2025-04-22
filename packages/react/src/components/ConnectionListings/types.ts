import { type PlainObject, type RequestOptions } from '@graphql-box/core';
import { type MutableRefObject, type ReactElement } from 'react';

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
  lastItemRef: MutableRefObject<HTMLDivElement | null>;
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
  renderError?: (errors: readonly Error[]) => ReactElement;
  renderLoader?: () => ReactElement;
  requestPath: string;
  resultsPerRequest?: number;
} & RequestOptions;

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
