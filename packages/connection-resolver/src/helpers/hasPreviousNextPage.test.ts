import { hasPreviousPage } from './hasPreviousNextPage.ts';

describe('hasPreviousPage', () => {
  describe('when first page number is 1 and start index is 0', () => {
    const cachedEdgesByPage = [
      {
        edges: [],
        pageNumber: 1,
      },
    ];

    const startIndex = { absolute: 0, relative: 0 };

    it('should return the correct value', () => {
      expect(hasPreviousPage({ cachedEdgesByPage, startIndex })).toBe(false);
    });
  });

  describe('when start index is NOT 0', () => {
    const cachedEdgesByPage = [
      {
        edges: [],
        pageNumber: 1,
      },
    ];

    const startIndex = { absolute: 5, relative: 5 };

    it('should return the correct value', () => {
      expect(hasPreviousPage({ cachedEdgesByPage, startIndex })).toBe(true);
    });
  });

  describe('when first page number is NOT 1', () => {
    const cachedEdgesByPage = [
      {
        edges: [],
        pageNumber: 3,
      },
    ];

    const startIndex = { absolute: 0, relative: 0 };

    it('should return the correct value', () => {
      expect(hasPreviousPage({ cachedEdgesByPage, startIndex })).toBe(true);
    });
  });
});
