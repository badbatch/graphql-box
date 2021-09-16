import { ConnectionInputOptions, Context } from "../defs";
import getCount from "./getCount";
import getDirection from "./getDirection";
import getIndexesOnLastPage from "./getIndexesOnLastPage";
import isFirstPage from "./isFirstPage";
import isLastPage from "./isLastPage";

export const getStartIndex = (
  args: ConnectionInputOptions,
  { entry: { index, page } }: Pick<Context, "entry">,
): number => {
  const count = getCount(args);

  return getDirection(args.before) === "forward"
    ? index + 1
    : isFirstPage(page) && index - count < 0
    ? 0
    : index - count;
};

export const getEndIndex = (
  args: ConnectionInputOptions,
  { entry: { index, page }, metadata: { totalPages, totalResults }, resultsPerPage }: Context,
): number => {
  const count = getCount(args);
  const indexesOnLastPage = getIndexesOnLastPage({ resultsPerPage, totalResults });

  return getDirection(args.before) === "backward"
    ? index - 1
    : isLastPage({ page, totalPages }) && index + count > indexesOnLastPage
    ? indexesOnLastPage
    : index + count;
};
