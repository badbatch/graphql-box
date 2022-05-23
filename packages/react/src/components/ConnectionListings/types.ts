import { PlainObjectMap } from "@graphql-box/core";
import { MutableRefObject, ReactElement } from "react";

export type ConnectionVariables = {
  after?: string;
  before?: string;
  first?: number;
  last?: number;
};

export type ConnectionResponse<Item extends PlainObjectMap> = {
  [key: string]: {
    edges?: Edge<Item>[];
    pageInfo: PageInfo;
    totalCount: number;
  };
};

export type Edge<Item extends PlainObjectMap> = {
  cursor: string;
  node: Item; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type ListingsChildrenProps<Item extends PlainObjectMap> = {
  hasNextPage: boolean;
  lastItemRef: MutableRefObject<HTMLDivElement | null>;
  listings: Item[];
  loading: boolean;
};

export type ListingsProps<Item extends PlainObjectMap> = {
  children: (props: ListingsChildrenProps<Item>) => ReactElement | null;
  intersectionRoot?: IntersectionObserverInit["root"];
  intersectionRootMargin?: IntersectionObserverInit["rootMargin"];
  intersectionThreshold?: IntersectionObserverInit["threshold"];
  query: string;
  renderError?: (errors: readonly Error[]) => ReactElement;
  renderLoader?: () => ReactElement;
  requestPath: string;
  resultsPerRequest?: number;
  variables: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type ListingsData<Item extends PlainObjectMap> = {
  hasNextPage: boolean;
  listings: Map<string, ConnectionResponse<Item>>;
};

export type PageInfo = {
  __typename?: "PageInfo";
  endCursor?: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
};
