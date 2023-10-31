import { getCount } from './getCount.ts';

describe('getCount', () => {
  describe('when `first` is provided', () => {
    it('should return the correct value', () => {
      expect(getCount({ first: 5 })).toBe(5);
    });
  });

  describe('when `last` is provided', () => {
    it('should return the correct value', () => {
      expect(getCount({ last: 5 })).toBe(5);
    });
  });
});
