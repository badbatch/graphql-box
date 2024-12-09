import { type CursorCacheEntry } from '../types.ts';
import { isCursorLast } from './isCursorLast.ts';

describe('isCursorLast', () => {
  describe('when cursor is last', () => {
    const entry = { index: 2, page: 6 };

    it('should return the correct value', () => {
      expect(
        isCursorLast({
          direction: 'forward',
          entry: entry as CursorCacheEntry,
          resultsPerPage: 10,
          totalPages: 6,
          totalResults: 53,
        }),
      ).toBe(true);
    });
  });

  describe('when cursor is NOT last', () => {
    const entry = { index: 0, page: 6 };

    it('should return the correct value', () => {
      expect(
        isCursorLast({
          direction: 'forward',
          entry: entry as CursorCacheEntry,
          resultsPerPage: 10,
          totalPages: 6,
          totalResults: 53,
        }),
      ).toBe(false);
    });
  });
});
