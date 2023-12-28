import { isCursorSupplied } from './isCursorSupplied.ts';

describe('isCursorSupplied', () => {
  describe("when neither 'before' nor 'after' are passed in", () => {
    it('should return the correct value', () => {
      expect(isCursorSupplied({})).toBe(false);
    });
  });

  describe("when 'before' is passed in", () => {
    it('should return the correct value', () => {
      expect(isCursorSupplied({ before: '12345' })).toBe(true);
    });
  });

  describe("when 'after' is passed in", () => {
    it('should return the correct value', () => {
      expect(isCursorSupplied({ after: '12345' })).toBe(true);
    });
  });

  describe("when 'before' and 'after' are passed in", () => {
    it('should return the correct value', () => {
      expect(isCursorSupplied({ after: '12345', before: '12345' })).toBe(true);
    });
  });
});
