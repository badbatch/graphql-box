import { getDirection } from './getDirection.ts';

describe('getDirection', () => {
  describe('when last is provided', () => {
    it('should return "backward"', () => {
      expect(getDirection(5)).toBe('backward');
    });
  });

  describe('when last is NOT provided', () => {
    it('should return "forward"', () => {
      expect(getDirection()).toBe('forward');
    });
  });
});
