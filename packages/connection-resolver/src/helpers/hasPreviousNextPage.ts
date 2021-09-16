import { CachedEdges, CursorGroupMetadata } from "../defs";
import getIndexesOnLastPage from "./getIndexesOnLastPage";

export type HasPreviousPageParams = {
  cachedEdgesByPage: CachedEdges[];
  startIndex: number;
};

export type HasNextPageParams = {
  cachedEdgesByPage: CachedEdges[];
  endIndex: number;
  metadata: CursorGroupMetadata;
  resultsPerPage: number;
};

export const hasPreviousPage = ({ cachedEdgesByPage, startIndex }: HasPreviousPageParams) => {
  const firstPage = cachedEdgesByPage[0];
  return !(firstPage.pageNumber === 1 && startIndex === 0);
};

export const hasNextPage = ({
  cachedEdgesByPage,
  endIndex,
  metadata: { totalPages, totalResults },
  resultsPerPage,
}: HasNextPageParams) => {
  const lastPage = cachedEdgesByPage[cachedEdgesByPage.length - 1];
  const indexesOnLastPage = getIndexesOnLastPage({ resultsPerPage, totalResults });
  const remainder = endIndex % resultsPerPage;
  return !(lastPage.pageNumber === totalPages && indexesOnLastPage === remainder);
};
