import { isNumber } from 'lodash-es';
import { type CachedEdges, type CursorGroupMetadata, type Indexes } from '../types.ts';
import { getIndexesOnLastPage } from './getIndexesOnLastPage.ts';

export type HasPreviousPageParams = {
  cachedEdgesByPage: CachedEdges[];
  startIndex: Indexes;
};

export type HasNextPageParams = {
  cachedEdgesByPage: CachedEdges[];
  endIndex: Indexes;
  metadata: CursorGroupMetadata;
  resultsPerPage: number;
};

export const hasPreviousPage = ({ cachedEdgesByPage, startIndex }: HasPreviousPageParams) =>
  (isNumber(cachedEdgesByPage[0]?.pageNumber) && cachedEdgesByPage[0]?.pageNumber !== 1) || startIndex.relative > 0;

export const hasNextPage = ({
  cachedEdgesByPage,
  endIndex,
  metadata: { totalPages, totalResults },
  resultsPerPage,
}: HasNextPageParams) =>
  (isNumber(cachedEdgesByPage.at(-1)?.pageNumber) && cachedEdgesByPage.at(-1)?.pageNumber !== totalPages) ||
  endIndex.relative < getIndexesOnLastPage({ resultsPerPage, totalResults });
