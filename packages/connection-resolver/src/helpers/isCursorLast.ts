import { type CursorCacheEntry, type Direction } from '../types.ts';
import { getIndexesOnLastPage } from './getIndexesOnLastPage.ts';

export type Params = {
  direction: Direction;
  entry: CursorCacheEntry;
  resultsPerPage: number;
  totalPages: number;
  totalResults: number;
};

export const isCursorLast = ({ direction, entry: { index, page }, resultsPerPage, totalPages, totalResults }: Params) =>
  direction === 'forward' && page === totalPages && index === getIndexesOnLastPage({ resultsPerPage, totalResults });
