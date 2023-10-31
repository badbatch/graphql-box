import { getCursor } from './getCursor.ts';

describe('getCursor', () => {
  describe('when `before` is provided', () => {
    it('should return the correct value', () => {
      expect(getCursor({ before: 'abcdefg' })).toBe('abcdefg');
    });
  });

  describe('when `after` is provided', () => {
    it('should return the correct value', () => {
      expect(getCursor({ after: 'abcdefg' })).toBe('abcdefg');
    });
  });
});
