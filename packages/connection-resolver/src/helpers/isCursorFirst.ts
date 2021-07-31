import { CursorCacheEntry, Direction } from "../defs";

export type Params = {
  direction: Direction;
  entry: CursorCacheEntry;
};

export default ({ direction, entry: { index, page } }: Params) => direction === "backward" && page === 1 && index === 0;
