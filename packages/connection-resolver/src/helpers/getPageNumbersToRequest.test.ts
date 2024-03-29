import { getPageNumbersToRequest } from './getPageNumbersToRequest.ts';

describe('getPageNumbersToRequest', () => {
  describe('when direction is forward', () => {
    const args = {
      after: 'abcdefg',
    };

    const ctx = {
      endIndex: { absolute: 22, relative: 5 },
      entry: {
        group: 'group',
        index: 2,
        node: { id: '123' },
        page: 2,
      },
      metadata: {
        totalPages: 5,
        totalResults: 50,
      },
      resultsPerPage: 10,
      startIndex: { absolute: 3, relative: 3 },
    };

    it('should return the correct value', () => {
      expect(getPageNumbersToRequest(args, ctx)).toEqual([2, 3, 4]);
    });
  });

  describe('when direction is backward', () => {
    const args = {
      last: 5,
    };

    const ctx = {
      endIndex: { absolute: 4, relative: 4 },
      entry: {
        group: 'group',
        index: 3,
        node: { id: '123' },
        page: 4,
      },
      metadata: {
        totalPages: 5,
        totalResults: 50,
      },
      page: 4,
      resultsPerPage: 10,
      startIndex: { absolute: -5, relative: 6 },
    };

    it('should return the correct value', () => {
      expect(getPageNumbersToRequest(args, ctx)).toEqual([3, 4]);
    });
  });
});
