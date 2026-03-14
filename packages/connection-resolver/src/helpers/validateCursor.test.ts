import { Core } from '@cachemap/core';
import { type GraphQLResolveInfo } from 'graphql';
import { type Context, validateCursor } from './validateCursor.ts';

describe('validateCursor', () => {
  const ctx: Context = {
    cursorCache: new Core({
      name: 'GRAPHQL_BOX_CONNECTION_RESOLVER',
      type: 'CONNECTION_RESOLVER',
    }),
    groupCursor: 'abcdefg',
    resultsPerPage: 10,
  };

  beforeEach(() => {
    ctx.cursorCache.clear();
  });

  describe('when `after` is provided but `first` is NOT', () => {
    const info = {};

    it('should return the correct error', () => {
      const result = validateCursor({ after: 'abcdefg' }, info as GraphQLResolveInfo, ctx);

      expect(result?.message).toBe(
        'Invalid connection argument combination. `after` must be used in combination with `first`.',
      );
    });
  });

  describe('when `after` and `last` are provided', () => {
    const info = {};

    it('should return the correct error', () => {
      const result = validateCursor({ after: 'abcdefg', last: 5 }, info as GraphQLResolveInfo, ctx);

      expect(result?.message).toBe(
        'Invalid connection argument combination. `after` cannot be used in combination with `last`.',
      );
    });
  });

  describe('when `before` is provided but `last` is NOT', () => {
    const info = {};

    it('should return the correct error', () => {
      const result = validateCursor({ before: 'abcdefg' }, info as GraphQLResolveInfo, ctx);

      expect(result?.message).toBe(
        'Invalid connection argument combination. `before` must be used in combination with `last`.',
      );
    });
  });

  describe('when `before` and `first` are provided', () => {
    const info = {};

    it('should return the correct error', () => {
      const result = validateCursor({ before: 'abcdefg', first: 5 }, info as GraphQLResolveInfo, ctx);

      expect(result?.message).toBe(
        'Invalid connection argument combination. `before` cannot be used in combination with `first`.',
      );
    });
  });

  describe('when a cursor was not previously provided', () => {
    const args = { after: 'abcdefg', first: 5, query: 'Hello world!' };
    const info = {};

    it('should return the correct error', () => {
      const result = validateCursor(args, info as GraphQLResolveInfo, ctx);
      expect(result?.message).toBe('Cursor cannot be supplied without previously being provided.');
    });
  });

  describe('when a cursor could not be found', () => {
    const args = { after: 'abcdefg', first: 5, query: 'Hello world!' };
    const info = {};

    it('should return the correct error', () => {
      ctx.cursorCache.set(`${ctx.groupCursor}-metadata`, { totalPages: 10, totalResults: 100 });
      const result = validateCursor(args, info as GraphQLResolveInfo, ctx);
      expect(result?.message).toBe('The cursor abcdefg could not be found.');
    });
  });

  describe('when a cursor is the last', () => {
    const args = { after: 'abcdefg', first: 5, query: 'Hello world!' };
    const info = {};

    it('should return the correct error', () => {
      ctx.cursorCache.set(`${ctx.groupCursor}-metadata`, { totalPages: 6, totalResults: 53 });
      ctx.cursorCache.set('abcdefg', { index: 2, page: 6 });
      const result = validateCursor(args, info as GraphQLResolveInfo, ctx);
      expect(result?.message).toBe('The cursor abcdefg is the last, you cannot go forward any further.');
    });
  });

  describe('when a cursor is the first', () => {
    const args = { before: 'abcdefg', last: 5, query: 'Hello world!' };
    const info = {};

    it('should return the correct error', () => {
      ctx.cursorCache.set(`${ctx.groupCursor}-metadata`, { totalPages: 6, totalResults: 53 });
      ctx.cursorCache.set('abcdefg', { index: 0, page: 1 });
      const result = validateCursor(args, info as GraphQLResolveInfo, ctx);
      expect(result?.message).toBe('The cursor abcdefg is the first, you cannot go backward any further.');
    });
  });

  describe('when `after` and `first` are provided and the cursor is not invalid', () => {
    const args = { after: 'abcdefg', first: 5, query: 'Hello world!' };
    const info = {};

    it('should return undefined', () => {
      ctx.cursorCache.set(`${ctx.groupCursor}-metadata`, { totalPages: 6, totalResults: 53 });
      ctx.cursorCache.set('abcdefg', { index: 0, page: 2 });
      const result = validateCursor(args, info as GraphQLResolveInfo, ctx);
      expect(result).toBeUndefined();
    });
  });

  describe('when `before` and `last` are provided and the cursor is not invalid', () => {
    const args = { before: 'abcdefg', last: 5, query: 'Hello world!' };
    const info = {};

    it('should return undefined', () => {
      ctx.cursorCache.set(`${ctx.groupCursor}-metadata`, { totalPages: 6, totalResults: 53 });
      ctx.cursorCache.set('abcdefg', { index: 0, page: 2 });
      const result = validateCursor(args, info as GraphQLResolveInfo, ctx);
      expect(result).toBeUndefined();
    });
  });
});
