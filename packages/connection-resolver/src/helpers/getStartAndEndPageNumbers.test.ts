import { getEndPageNumber, getStartPageNumber } from './getStartAndEndPageNumbers.ts';

describe('getStartPageNumber', () => {
  describe('when the direction is forward', () => {
    const args = {
      after: 'abcdefg',
    };

    const ctx = {
      metadata: {
        totalPages: 5,
        totalResults: 50,
      },
      page: 3,
      resultsPerPage: 10,
      startIndex: { absolute: 5, relative: 5 },
    };

    it('should return the correct value', () => {
      expect(getStartPageNumber(args, ctx)).toBe(3);
    });
  });

  describe('when the direction is backward', () => {
    describe('when start index is greater or equal to zero', () => {
      const args = {
        last: 5,
      };

      const ctx = {
        metadata: {
          totalPages: 5,
          totalResults: 50,
        },
        page: 3,
        resultsPerPage: 10,
        startIndex: { absolute: 1, relative: 1 },
      };

      it('should return the correct value', () => {
        expect(getStartPageNumber(args, ctx)).toBe(3);
      });
    });

    describe('when start page number is less than or equal to 1', () => {
      const args = {
        last: 5,
      };

      const ctx = {
        metadata: {
          totalPages: 5,
          totalResults: 50,
        },
        page: 3,
        resultsPerPage: 10,
        startIndex: { absolute: -35, relative: 5 },
      };

      it('should return the correct value', () => {
        expect(getStartPageNumber(args, ctx)).toBe(1);
      });
    });

    describe('when start page number is NOT less than or equal to 1', () => {
      const args = {
        last: 5,
      };

      const ctx = {
        metadata: {
          totalPages: 5,
          totalResults: 50,
        },
        page: 4,
        resultsPerPage: 10,
        startIndex: { absolute: -15, relative: 5 },
      };

      it('should return the correct value', () => {
        expect(getStartPageNumber(args, ctx)).toBe(2);
      });
    });
  });
});

describe('getEndPageNumber', () => {
  describe('when the direction is backward', () => {
    const args = {
      last: 5,
    };

    const ctx = {
      endIndex: { absolute: 5, relative: 5 },
      metadata: {
        totalPages: 5,
        totalResults: 50,
      },
      page: 3,
      resultsPerPage: 10,
    };

    it('should return the correct value', () => {
      expect(getEndPageNumber(args, ctx)).toBe(3);
    });
  });

  describe('when the direction is forward', () => {
    describe('when the page is the last page', () => {
      const args = {
        after: 'abcdefg',
      };

      const ctx = {
        endIndex: { absolute: 5, relative: 5 },
        metadata: {
          totalPages: 5,
          totalResults: 50,
        },
        page: 5,
        resultsPerPage: 10,
      };

      it('should return the correct value', () => {
        expect(getEndPageNumber(args, ctx)).toBe(5);
      });
    });

    describe('when the end index is less than the indexes per page', () => {
      const args = {
        after: 'abcdefg',
      };

      const ctx = {
        endIndex: { absolute: 9, relative: 9 },
        metadata: {
          totalPages: 5,
          totalResults: 50,
        },
        page: 3,
        resultsPerPage: 10,
      };

      it('should return the correct value', () => {
        expect(getEndPageNumber(args, ctx)).toBe(3);
      });
    });

    describe('when the end page number is greater or equal to total pages', () => {
      const args = {
        after: 'abcdefg',
      };

      const ctx = {
        endIndex: { absolute: 37, relative: 6 },
        metadata: {
          totalPages: 5,
          totalResults: 50,
        },
        page: 3,
        resultsPerPage: 10,
      };

      it('should return the correct value', () => {
        expect(getEndPageNumber(args, ctx)).toBe(5);
      });
    });

    describe('when the end page number is NOT greater or equal to total pages', () => {
      const args = {
        after: 'abcdefg',
      };

      const ctx = {
        endIndex: { absolute: 22, relative: 4 },
        metadata: {
          totalPages: 5,
          totalResults: 50,
        },
        page: 2,
        resultsPerPage: 10,
      };

      it('should return the correct value', () => {
        expect(getEndPageNumber(args, ctx)).toBe(4);
      });
    });
  });
});
