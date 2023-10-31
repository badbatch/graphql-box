import { getIndexesOnCurrentPage } from './getIndexesOnCurrentPage.ts';

describe('getIndexesOnCurrentPage', () => {
  describe('when current page is last page', () => {
    it('should return the correct value', () => {
      expect(
        getIndexesOnCurrentPage({ metadata: { totalPages: 6, totalResults: 53 }, page: 6, resultsPerPage: 10 })
      ).toBe(2);
    });
  });

  describe('when current page is NOT last page', () => {
    it('should return the correct value', () => {
      expect(
        getIndexesOnCurrentPage({ metadata: { totalPages: 6, totalResults: 53 }, page: 5, resultsPerPage: 10 })
      ).toBe(9);
    });
  });
});
