import { getIndexesOnLastPage } from './getIndexesOnLastPage.ts';

describe('getIndexesOnLastPage', () => {
  describe('when results on last page equal results per page', () => {
    it('should return the correct value', () => {
      expect(getIndexesOnLastPage({ resultsPerPage: 10, totalResults: 50 })).toBe(9);
    });
  });

  describe('when results on last page do NOT equal results per page', () => {
    it('should return the correct value', () => {
      expect(getIndexesOnLastPage({ resultsPerPage: 10, totalResults: 53 })).toBe(2);
    });
  });
});
