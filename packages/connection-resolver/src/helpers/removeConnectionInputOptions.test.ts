import removeConnectionInputOptions from "./removeConnectionInputOptions";

describe("removeConnectionInputOptions", () => {
  test("when connection input options are passed in", () => {
    const args = {
      after: "abcdefg",
      alpha: "bravo",
      before: "higklmn",
      first: 10,
      last: 5,
    };

    expect(removeConnectionInputOptions(args)).toEqual({
      alpha: "bravo",
    });
  });
});
