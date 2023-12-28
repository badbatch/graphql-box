import { getResultsOnLastPage } from './getResultsOnLastPage.ts';

describe('getResultsOnLastPage', () => {
  describe('when results on last page equal results per page', () => {
    it('should return the correct value', () => {
      expect(getResultsOnLastPage({ resultsPerPage: 10, totalResults: 50 })).toBe(10);
    });
  });

  describe('when results on last page do NOT equal results per page', () => {
    it('should return the correct value', () => {
      expect(getResultsOnLastPage({ resultsPerPage: 10, totalResults: 53 })).toBe(3);
    });
  });
});
