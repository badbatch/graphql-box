import getCount from "./getCount";

describe("getCount", () => {
  test("when `first` is provided", () => {
    expect(getCount({ first: 5 })).toBe(5);
  });

  test("when `last` is provided", () => {
    expect(getCount({ last: 5 })).toBe(5);
  });
});
