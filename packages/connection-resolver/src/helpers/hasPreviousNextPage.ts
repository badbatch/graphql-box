import { CachedEdges, CursorGroupMetadata, Indexes } from "../defs";
import getIndexesOnLastPage from "./getIndexesOnLastPage";

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
  cachedEdgesByPage[0].pageNumber !== 1 || startIndex.relative > 0;

export const hasNextPage = ({ cachedEdgesByPage, endIndex, metadata, resultsPerPage }: HasNextPageParams) =>
  cachedEdgesByPage[cachedEdgesByPage.length - 1].pageNumber !== metadata.totalPages ||
  endIndex.relative < getIndexesOnLastPage({ resultsPerPage, totalResults: metadata.totalResults });
