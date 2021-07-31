import { getEndIndex, getStartIndex } from "./getStartAndEndIndexes";

describe("getStartIndex", () => {
  test("when the direction is forward", () => {
    const args = {
      after: "abcdefg",
      first: 5,
    };

    const ctx = {
      entry: {
        group: "qwerty",
        index: 5,
        node: {},
        page: 3,
      },
      metadata: {
        totalPages: 5,
        totalResults: 50,
      },
      resultsPerPage: 10,
    };

    expect(getStartIndex(args, ctx)).toBe(6);
  });

  describe("when the direction is backward", () => {
    test("when on first page and count takes the start index negative", () => {
      const args = {
        before: "abcdefg",
        last: 5,
      };

      const ctx = {
        entry: {
          group: "qwerty",
          index: 3,
          node: {},
          page: 1,
        },
        metadata: {
          totalPages: 5,
          totalResults: 50,
        },
        resultsPerPage: 10,
      };

      expect(getStartIndex(args, ctx)).toBe(0);
    });

    test("when on first page and count DOES NOT takes the start index negative", () => {
      const args = {
        before: "abcdefg",
        last: 2,
      };

      const ctx = {
        entry: {
          group: "qwerty",
          index: 4,
          node: {},
          page: 1,
        },
        metadata: {
          totalPages: 5,
          totalResults: 50,
        },
        resultsPerPage: 10,
      };

      expect(getStartIndex(args, ctx)).toBe(2);
    });

    test("when NOT on first page", () => {
      const args = {
        before: "abcdefg",
        last: 15,
      };

      const ctx = {
        entry: {
          group: "qwerty",
          index: 4,
          node: {},
          page: 3,
        },
        metadata: {
          totalPages: 5,
          totalResults: 50,
        },
        resultsPerPage: 10,
      };

      expect(getStartIndex(args, ctx)).toBe(-11);
    });
  });
});

describe("getEndIndex", () => {
  test("when the direction is backward", () => {
    const args = {
      before: "abcdefg",
      last: 5,
    };

    const ctx = {
      entry: {
        group: "qwerty",
        index: 5,
        node: {},
        page: 3,
      },
      metadata: {
        totalPages: 5,
        totalResults: 50,
      },
      resultsPerPage: 10,
    };

    expect(getEndIndex(args, ctx)).toBe(4);
  });

  describe("when the direction is forward", () => {
    test("when on last page and count takes end index over last index", () => {
      const args = {
        after: "abcdefg",
        first: 15,
      };

      const ctx = {
        entry: {
          group: "qwerty",
          index: 2,
          node: {},
          page: 6,
        },
        metadata: {
          totalPages: 6,
          totalResults: 57,
        },
        resultsPerPage: 10,
      };

      expect(getEndIndex(args, ctx)).toBe(6);
    });

    test("when on last page and count DOES NOT take end index over last index", () => {
      const args = {
        after: "abcdefg",
        first: 2,
      };

      const ctx = {
        entry: {
          group: "qwerty",
          index: 2,
          node: {},
          page: 6,
        },
        metadata: {
          totalPages: 6,
          totalResults: 57,
        },
        resultsPerPage: 10,
      };

      expect(getEndIndex(args, ctx)).toBe(4);
    });

    test("when NOT on last page", () => {
      const args = {
        after: "abcdefg",
        first: 20,
      };

      const ctx = {
        entry: {
          group: "qwerty",
          index: 2,
          node: {},
          page: 4,
        },
        metadata: {
          totalPages: 6,
          totalResults: 57,
        },
        resultsPerPage: 10,
      };

      expect(getEndIndex(args, ctx)).toBe(22);
    });
  });
});
