import { ConnectionInputOptions, CursorGroupMetadata } from "..";
import getDirection from "./getDirection";
import getIndexesOnLastPage from "./getIndexesOnLastPage";

export type Context = {
  metadata: CursorGroupMetadata;
  resultsPerPage: number;
};

export default (args: ConnectionInputOptions, { metadata: { totalPages, totalResults }, resultsPerPage }: Context) => {
  if (getDirection(args.last) === "backward") {
    return { index: getIndexesOnLastPage({ resultsPerPage, totalResults }) + 1, page: totalPages };
  }

  return { index: -1, page: 1 };
};
