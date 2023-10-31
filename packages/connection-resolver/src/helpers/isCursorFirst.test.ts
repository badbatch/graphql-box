import { type CursorCacheEntry } from '../types.ts';
import { isCursorFirst } from './isCursorFirst.ts';

describe('isCursorFirst', () => {
  describe('when cursor is first', () => {
    const entry = { index: 0, page: 1 };

    it('should return the correct value', () => {
      expect(isCursorFirst({ direction: 'backward', entry: entry as CursorCacheEntry })).toBe(true);
    });
  });

  describe('when cursor is NOT first', () => {
    const entry = { index: 1, page: 1 };

    it('should return the correct value', () => {
      expect(isCursorFirst({ direction: 'backward', entry: entry as CursorCacheEntry })).toBe(false);
    });
  });
});
