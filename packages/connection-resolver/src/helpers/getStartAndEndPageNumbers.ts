import { ConnectionInputOptions, Context, Indexes } from "../defs";
import getDirection from "./getDirection";
import isLastPage from "./isLastPage";

export type PageNumberContext = {
  endIndex: Indexes;
  page: number;
  startIndex: Indexes;
};

export const getStartPageNumber = (
  args: ConnectionInputOptions,
  { page, startIndex, resultsPerPage }: Omit<PageNumberContext, "endIndex"> & Omit<Context, "entry" | "metadata">,
) => {
  if (getDirection(args.before) === "forward" || startIndex.absolute >= 0) {
    return page;
  }

  const startPageNumber = page - Math.ceil(Math.abs(startIndex.absolute) / resultsPerPage);
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
  const indexesPerPage = resultsPerPage - 1;

  if (
    getDirection(args.before) === "backward" ||
    isLastPage({ page, totalPages }) ||
    endIndex.absolute <= indexesPerPage
  ) {
    return page;
  }

  const endPageNumber = page + Math.ceil((endIndex.absolute - indexesPerPage) / resultsPerPage);
  return endPageNumber >= totalPages ? totalPages : endPageNumber;
};
