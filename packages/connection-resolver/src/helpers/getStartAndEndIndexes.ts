import { type ConnectionInputOptions, type CursorGroupMetadata, type PartialCursorCacheEntry } from '../types.ts';
import { getCount } from './getCount.ts';
import { getDirection } from './getDirection.ts';
import { getIndexesOnLastPage } from './getIndexesOnLastPage.ts';
import { isFirstPage } from './isFirstPage.ts';
import { isLastPage } from './isLastPage.ts';

export type Context = {
  entry: PartialCursorCacheEntry;
  metadata: CursorGroupMetadata;
  resultsPerPage: number;
};

export const getStartIndex = (
  args: ConnectionInputOptions,
  { entry: { index, page }, resultsPerPage }: Pick<Context, 'entry' | 'resultsPerPage'>,
) => {
  const count = getCount(args);

  return getDirection(args.last) === 'forward'
    ? { absolute: index + 1, relative: index + 1 }
    : isFirstPage(page) && index - count < 0
      ? { absolute: 0, relative: 0 }
      : (() => {
          const absoluteStartIndex = index - count;

          if (absoluteStartIndex >= 0) {
            return { absolute: absoluteStartIndex, relative: absoluteStartIndex };
          }

          const indexesRemainingAfterLastPage = Math.abs(absoluteStartIndex);
          const pagesRemaining = indexesRemainingAfterLastPage / resultsPerPage + 1;
          const remainder = indexesRemainingAfterLastPage % resultsPerPage;
          const relativeStartIndex = remainder === 0 ? 0 : page - pagesRemaining < 0 ? 0 : resultsPerPage - remainder;
          return { absolute: absoluteStartIndex, relative: relativeStartIndex };
        })();
};

export const getEndIndex = (
  args: ConnectionInputOptions,
  { entry: { index, page }, metadata: { totalPages, totalResults }, resultsPerPage }: Context,
) => {
  const count = getCount(args);
  const indexesOnLastPage = getIndexesOnLastPage({ resultsPerPage, totalResults });

  return getDirection(args.last) === 'backward'
    ? { absolute: index - 1, relative: index - 1 }
    : isLastPage({ page, totalPages }) && index + count > indexesOnLastPage
      ? { absolute: indexesOnLastPage, relative: indexesOnLastPage }
      : (() => {
          const absoluteEndIndex = index + count;
          const indexesPerPage = resultsPerPage - 1;

          if (absoluteEndIndex <= indexesPerPage) {
            return { absolute: absoluteEndIndex, relative: absoluteEndIndex };
          }

          const indexesRemainingAfterFirstPage = absoluteEndIndex - indexesPerPage;
          const pagesRemaining = indexesRemainingAfterFirstPage / resultsPerPage;
          const remainder = indexesRemainingAfterFirstPage % resultsPerPage;

          const relativeEndIndex =
            remainder === 0 ? indexesPerPage : page + pagesRemaining > totalPages ? indexesOnLastPage : remainder - 1;

          return { absolute: absoluteEndIndex, relative: relativeEndIndex };
        })();
};
