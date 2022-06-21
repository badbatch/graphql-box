import hasRequestPathChanged from "./hasRequestPathChanged";

describe("hasRequestPathChanged", () => {
  const data = {
    alpha: {
      bravo: {
        charlie: {
          delta: undefined,
        },
      },
    },
  };

  test("when request path has NOT changed", () => {
    expect(hasRequestPathChanged("alpha.bravo.charlie.delta", data)).toBe(false);
  });

  test("when request path has changed", () => {
    expect(hasRequestPathChanged("alpha.bravo.charlie.echo", data)).toBe(true);
  });
});
