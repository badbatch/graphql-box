import { ConnectionInputOptions, Context } from "../defs";
import getDirection from "./getDirection";
import isLastPage from "./isLastPage";

export type PageNumberContext = {
  endIndex: number;
  page: number;
  startIndex: number;
};

export const getStartPageNumber = (
  args: ConnectionInputOptions,
  { page, startIndex, resultsPerPage }: Omit<PageNumberContext, "endIndex"> & Omit<Context, "entry" | "metadata">,
) => {
  if (getDirection(args.before) === "forward" || startIndex >= 0) {
    return page;
  }

  const startPageNumber = page - Math.ceil(Math.abs(startIndex) / resultsPerPage);
  return startPageNumber <= 1 ? 1 : startPageNumber;
};

export const getEndPageNumber = (
  args: ConnectionInputOptions,
  {
    endIndex,
    metadata: { totalPages },
    page,
    resultsPerPage,
  }: Omit<PageNumberContext, "startIndex"> & Omit<Context, "entry">,
) => {
  if (getDirection(args.before) === "backward" || isLastPage({ page, totalPages }) || endIndex <= resultsPerPage - 1) {
    return page;
  }

  const endPageNumber = page + Math.ceil((endIndex - (resultsPerPage - 1)) / resultsPerPage);
  return endPageNumber >= totalPages ? totalPages : endPageNumber;
};
