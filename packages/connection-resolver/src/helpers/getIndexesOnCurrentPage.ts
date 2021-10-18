import { Context } from "../defs";
import getResultsOnLastPage from "./getResultsOnLastPage";
import isLastPage from "./isLastPage";

export type IndexesOnCurrentPageContext = {
  page: number;
};

export default ({
  page,
  metadata: { totalPages, totalResults },
  resultsPerPage,
}: IndexesOnCurrentPageContext & Omit<Context, "entry">) =>
  (isLastPage({ page, totalPages }) ? getResultsOnLastPage({ resultsPerPage, totalResults }) : resultsPerPage) - 1;
