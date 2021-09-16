import { range } from "lodash";
import { ConnectionInputOptions, Context } from "../defs";
import { getEndPageNumber, getStartPageNumber } from "./getStartAndEndPageNumbers";

export type GetPageNumbersToRequestContext = {
  endIndex: number;
  startIndex: number;
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
