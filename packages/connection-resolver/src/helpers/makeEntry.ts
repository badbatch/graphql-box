import { type ConnectionInputOptions, type CursorGroupMetadata } from '../types.ts';
import { getDirection } from './getDirection.ts';
import { getIndexesOnLastPage } from './getIndexesOnLastPage.ts';

export type Context = {
  metadata: CursorGroupMetadata;
  resultsPerPage: number;
};

export const makeEntry = (
  args: ConnectionInputOptions,
  { metadata: { totalPages, totalResults }, resultsPerPage }: Context
) => {
  if (getDirection(args.last) === 'backward') {
    return { index: getIndexesOnLastPage({ resultsPerPage, totalResults }) + 1, page: totalPages };
  }

  return { index: -1, page: 1 };
};
