import { type CursorCacheEntry, type Direction } from '../types.ts';

export type Params = {
  direction: Direction;
  entry: CursorCacheEntry;
};

export const isCursorFirst = ({ direction, entry: { index, page } }: Params) =>
  direction === 'backward' && page === 1 && index === 0;
