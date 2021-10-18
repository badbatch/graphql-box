import { CursorCacheEntry, Direction } from "../defs";
import getIndexesOnLastPage from "./getIndexesOnLastPage";

export type Params = {
  direction: Direction;
  entry: CursorCacheEntry;
  resultsPerPage: number;
  totalPages: number;
  totalResults: number;
};

export default ({ direction, entry: { index, page }, resultsPerPage, totalPages, totalResults }: Params) =>
  direction === "forward" && page === totalPages && index === getIndexesOnLastPage({ resultsPerPage, totalResults });
