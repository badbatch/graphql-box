import { isFirstPage } from './isFirstPage.ts';

describe('isFirstPage', () => {
  describe('when page is first page', () => {
    it('should return the correct value', () => {
      expect(isFirstPage(1)).toBe(true);
    });
  });

  describe('when page is NOT first page', () => {
    it('should return the correct value', () => {
      expect(isFirstPage(5)).toBe(false);
    });
  });
});
