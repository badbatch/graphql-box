import { isLastPage } from './isLastPage.ts';

describe('isLastPage', () => {
  describe('when page is last page', () => {
    it('should return the correct value', () => {
      expect(isLastPage({ page: 5, totalPages: 5 })).toBe(true);
    });
  });

  describe('when page is NOT last page', () => {
    it('should return the correct value', () => {
      expect(isLastPage({ page: 4, totalPages: 5 })).toBe(false);
    });
  });
});
