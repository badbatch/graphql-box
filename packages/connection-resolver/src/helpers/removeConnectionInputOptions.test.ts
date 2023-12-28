import { removeConnectionInputOptions } from './removeConnectionInputOptions.ts';

describe('removeConnectionInputOptions', () => {
  describe('when connection input options are passed in', () => {
    const args = {
      after: 'abcdefg',
      alpha: 'bravo',
      before: 'higklmn',
      first: 10,
      last: 5,
    };

    it('should return the correct value', () => {
      expect(removeConnectionInputOptions(args)).toEqual({
        alpha: 'bravo',
      });
    });
  });
});
