import type { CursorGroupMetadata } from '../types.ts';
import { getResultsOnLastPage } from './getResultsOnLastPage.ts';
import { isLastPage } from './isLastPage.ts';

export type IndexesOnCurrentPageContext = {
  page: number;
};

export type Context = {
  metadata: CursorGroupMetadata;
  resultsPerPage: number;
};

export const getIndexesOnCurrentPage = ({
  metadata: { totalPages, totalResults },
  page,
  resultsPerPage,
}: IndexesOnCurrentPageContext & Context) =>
  (isLastPage({ page, totalPages }) ? getResultsOnLastPage({ resultsPerPage, totalResults }) : resultsPerPage) - 1;
