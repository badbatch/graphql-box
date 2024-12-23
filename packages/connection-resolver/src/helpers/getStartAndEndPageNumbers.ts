import { type ConnectionInputOptions, type CursorGroupMetadata, type Indexes } from '../types.ts';
import { getDirection } from './getDirection.ts';
import { isLastPage } from './isLastPage.ts';

export type PageNumberContext = {
  endIndex: Indexes;
  page: number;
  startIndex: Indexes;
};

export type Context = {
  metadata: CursorGroupMetadata;
  resultsPerPage: number;
};

export const getStartPageNumber = (
  args: ConnectionInputOptions,
  { page, resultsPerPage, startIndex }: Omit<PageNumberContext, 'endIndex'> & Omit<Context, 'metadata'>,
) => {
  if (getDirection(args.last) === 'forward' || startIndex.absolute >= 0) {
    return page;
  }

  const startPageNumber = page - Math.ceil(Math.abs(startIndex.absolute) / resultsPerPage);
  return Math.max(startPageNumber, 1);
};

export const getEndPageNumber = (
  args: ConnectionInputOptions,
  { endIndex, metadata: { totalPages }, page, resultsPerPage }: Omit<PageNumberContext, 'startIndex'> & Context,
) => {
  const indexesPerPage = resultsPerPage - 1;

  if (
    getDirection(args.last) === 'backward' ||
    isLastPage({ page, totalPages }) ||
    endIndex.absolute <= indexesPerPage
  ) {
    return page;
  }

  const endPageNumber = page + Math.ceil((endIndex.absolute - indexesPerPage) / resultsPerPage);
  return Math.min(endPageNumber, totalPages);
};
