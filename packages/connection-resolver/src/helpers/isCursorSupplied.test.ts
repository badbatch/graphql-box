import isCursorSupplied from "./isCursorSupplied";

describe("isCursorSupplied", () => {
  test("when neither 'before' nor 'after' are passed in", () => {
    expect(isCursorSupplied({})).toBe(false);
  });

  test("when 'before' is passed in", () => {
    expect(isCursorSupplied({ before: "12345" })).toBe(true);
  });

  test("when 'after' is passed in", () => {
    expect(isCursorSupplied({ after: "12345" })).toBe(true);
  });

  test("when 'before' and 'after' are passed in", () => {
    expect(isCursorSupplied({ after: "12345", before: "12345" })).toBe(true);
  });
});
