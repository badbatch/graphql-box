import { hasRequestPathChanged } from './hasRequestPathChanged.ts';

describe('hasRequestPathChanged', () => {
  const data = {
    alpha: {
      bravo: {
        charlie: {
          delta: undefined,
        },
        echo: [
          {
            foxtrot: 'golf',
            hotel: undefined,
          },
        ],
      },
    },
  };

  describe('when request path has NOT changed', () => {
    describe('when the request path passes through an object', () => {
      it('should return false', () => {
        expect(hasRequestPathChanged('alpha.bravo.charlie.delta', data)).toBe(false);
      });
    });

    describe('when the request path passes through an array', () => {
      it('should return false', () => {
        expect(hasRequestPathChanged('alpha.bravo.echo.0.foxtrot', data)).toBe(false);
      });
    });
  });

  describe('when request path has changed', () => {
    describe('when the request path passes through an object', () => {
      it('should return true', () => {
        expect(hasRequestPathChanged('alpha.bravo.charlie.echo', data)).toBe(true);
      });
    });

    describe('when the request path passes through an array', () => {
      it('should return true', () => {
        expect(hasRequestPathChanged('alpha.bravo.echo.0.india', data)).toBe(true);
      });
    });

    describe('when the request path passes through a non object or array', () => {
      it('should return true', () => {
        expect(hasRequestPathChanged('alpha.bravo.echo.0.foxtrot.india', data)).toBe(true);
      });
    });
  });
});
