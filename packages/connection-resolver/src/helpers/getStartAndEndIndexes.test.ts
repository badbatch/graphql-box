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
        node: { id: "123" },
        page: 3,
      },
      metadata: {
        totalPages: 5,
        totalResults: 50,
      },
      resultsPerPage: 10,
    };

    expect(getStartIndex(args, ctx)).toEqual({ absolute: 6, relative: 6 });
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
          node: { id: "123" },
          page: 1,
        },
        metadata: {
          totalPages: 5,
          totalResults: 50,
        },
        resultsPerPage: 10,
      };

      expect(getStartIndex(args, ctx)).toEqual({ absolute: 0, relative: 0 });
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
          node: { id: "123" },
          page: 1,
        },
        metadata: {
          totalPages: 5,
          totalResults: 50,
        },
        resultsPerPage: 10,
      };

      expect(getStartIndex(args, ctx)).toEqual({ absolute: 2, relative: 2 });
    });

    describe("when NOT on first page", () => {
      test("when the start index is more than than or equal to 0", () => {
        const args = {
          before: "abcdefg",
          last: 4,
        };

        const ctx = {
          entry: {
            group: "qwerty",
            index: 7,
            node: { id: "123" },
            page: 3,
          },
          metadata: {
            totalPages: 5,
            totalResults: 50,
          },
          resultsPerPage: 10,
        };

        expect(getStartIndex(args, ctx)).toEqual({ absolute: 3, relative: 3 });
      });

      test("when the start index is less than 0", () => {
        const args = {
          before: "abcdefg",
          last: 15,
        };

        const ctx = {
          entry: {
            group: "qwerty",
            index: 4,
            node: { id: "123" },
            page: 3,
          },
          metadata: {
            totalPages: 5,
            totalResults: 50,
          },
          resultsPerPage: 10,
        };

        expect(getStartIndex(args, ctx)).toEqual({ absolute: -11, relative: 9 });
      });
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
        node: { id: "123" },
        page: 3,
      },
      metadata: {
        totalPages: 5,
        totalResults: 50,
      },
      resultsPerPage: 10,
    };

    expect(getEndIndex(args, ctx)).toEqual({ absolute: 4, relative: 4 });
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
          node: { id: "123" },
          page: 6,
        },
        metadata: {
          totalPages: 6,
          totalResults: 57,
        },
        resultsPerPage: 10,
      };

      expect(getEndIndex(args, ctx)).toEqual({ absolute: 6, relative: 6 });
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
          node: { id: "123" },
          page: 6,
        },
        metadata: {
          totalPages: 6,
          totalResults: 57,
        },
        resultsPerPage: 10,
      };

      expect(getEndIndex(args, ctx)).toEqual({ absolute: 4, relative: 4 });
    });

    describe("when NOT on last page", () => {
      test("when the end index is less than or equal to indexes per page", () => {
        const args = {
          after: "abcdefg",
          first: 7,
        };

        const ctx = {
          entry: {
            group: "qwerty",
            index: 2,
            node: { id: "123" },
            page: 4,
          },
          metadata: {
            totalPages: 6,
            totalResults: 57,
          },
          resultsPerPage: 10,
        };

        expect(getEndIndex(args, ctx)).toEqual({ absolute: 9, relative: 9 });
      });

      test("when end index is greater than indexes per page", () => {
        const args = {
          after: "abcdefg",
          first: 20,
        };

        const ctx = {
          entry: {
            group: "qwerty",
            index: 2,
            node: { id: "123" },
            page: 4,
          },
          metadata: {
            totalPages: 6,
            totalResults: 57,
          },
          resultsPerPage: 10,
        };

        expect(getEndIndex(args, ctx)).toEqual({ absolute: 22, relative: 2 });
      });
    });
  });
});
