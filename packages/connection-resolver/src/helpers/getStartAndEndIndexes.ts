import { ConnectionInputOptions, Context } from "../defs";
import getCount from "./getCount";
import getDirection from "./getDirection";
import getIndexesOnLastPage from "./getIndexesOnLastPage";
import isFirstPage from "./isFirstPage";
import isLastPage from "./isLastPage";

export const getStartIndex = (
  args: ConnectionInputOptions,
  { entry: { index, page }, resultsPerPage }: Pick<Context, "entry" | "resultsPerPage">,
) => {
  const count = getCount(args);

  return getDirection(args.last) === "forward"
    ? { absolute: index + 1, relative: index + 1 }
    : isFirstPage(page) && index - count < 0
    ? { absolute: 0, relative: 0 }
    : (() => {
        const absStartIndex = index - count;

        if (absStartIndex >= 0) {
          return { absolute: absStartIndex, relative: absStartIndex };
        }

        const indexesRemainingAfterLastPage = Math.abs(absStartIndex);
        const pagesRemaining = indexesRemainingAfterLastPage / resultsPerPage + 1;
        const remainder = indexesRemainingAfterLastPage % resultsPerPage;
        const relStartIndex = remainder === 0 ? 0 : page - pagesRemaining < 0 ? 0 : resultsPerPage - remainder;
        return { absolute: absStartIndex, relative: relStartIndex };
      })();
};

export const getEndIndex = (
  args: ConnectionInputOptions,
  { entry: { index, page }, metadata: { totalPages, totalResults }, resultsPerPage }: Context,
) => {
  const count = getCount(args);
  const indexesOnLastPage = getIndexesOnLastPage({ resultsPerPage, totalResults });

  return getDirection(args.last) === "backward"
    ? { absolute: index - 1, relative: index - 1 }
    : isLastPage({ page, totalPages }) && index + count > indexesOnLastPage
    ? { absolute: indexesOnLastPage, relative: indexesOnLastPage }
    : (() => {
        const absEndIndex = index + count;
        const indexesPerPage = resultsPerPage - 1;

        if (absEndIndex <= indexesPerPage) {
          return { absolute: absEndIndex, relative: absEndIndex };
        }

        const indexesRemainingAfterFirstPage = absEndIndex - indexesPerPage;
        const pagesRemaining = indexesRemainingAfterFirstPage / resultsPerPage;
        const remainder = indexesRemainingAfterFirstPage % resultsPerPage;

        const relEndIndex =
          remainder === 0 ? indexesPerPage : page + pagesRemaining > totalPages ? indexesOnLastPage : remainder - 1;

        return { absolute: absEndIndex, relative: relEndIndex };
      })();
};
