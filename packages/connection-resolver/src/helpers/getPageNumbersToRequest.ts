import { range } from "lodash";
import { ConnectionInputOptions, Context, Indexes } from "../defs";
import { getEndPageNumber, getStartPageNumber } from "./getStartAndEndPageNumbers";

export type GetPageNumbersToRequestContext = {
  endIndex: Indexes;
  startIndex: Indexes;
};

export default (
  args: ConnectionInputOptions,
  { endIndex, entry: { page }, metadata, resultsPerPage, startIndex }: GetPageNumbersToRequestContext & Context,
) => {
  const startPageNumber = getStartPageNumber(args, { page, startIndex, resultsPerPage });
  const endPageNumber = getEndPageNumber(args, { endIndex, metadata, page, resultsPerPage });

  if (startPageNumber === endPageNumber) {
    return [page];
  }

  return [...range(startPageNumber, endPageNumber), endPageNumber];
};
