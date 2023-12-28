import { range } from 'lodash-es';
import {
  type ConnectionInputOptions,
  type CursorGroupMetadata,
  type Indexes,
  type PartialCursorCacheEntry,
} from '../types.ts';
import { getEndPageNumber, getStartPageNumber } from './getStartAndEndPageNumbers.ts';

export type GetPageNumbersToRequestContext = {
  endIndex: Indexes;
  startIndex: Indexes;
};

export type Context = {
  entry: PartialCursorCacheEntry;
  metadata: CursorGroupMetadata;
  resultsPerPage: number;
};

export const getPageNumbersToRequest = (
  args: ConnectionInputOptions,
  { endIndex, entry: { page }, metadata, resultsPerPage, startIndex }: GetPageNumbersToRequestContext & Context
) => {
  const startPageNumber = getStartPageNumber(args, { page, resultsPerPage, startIndex });
  const endPageNumber = getEndPageNumber(args, { endIndex, metadata, page, resultsPerPage });

  if (startPageNumber === endPageNumber) {
    return [page];
  }

  return [...range(startPageNumber, endPageNumber), endPageNumber];
};
