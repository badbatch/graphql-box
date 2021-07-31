import Cachemap from "@cachemap/core";
import map from "@cachemap/map";
import { GraphQLError, GraphQLResolveInfo } from "graphql";
import validateCursor, { Context } from "./validateCursor";

describe("validateCursor", () => {
  const ctx: Context = {
    cursorCache: new Cachemap({
      name: "GRAPHQL_BOX_CONNECTION_RESOLVER",
      store: map(),
    }),
    groupCursor: "abcdefg",
    resultsPerPage: 10,
  };

  beforeEach(async () => {
    await ctx.cursorCache.clear();
  });

  test("when `after` is provided but `first` is NOT", async () => {
    const info = {};

    expect(
      ((await validateCursor({ after: "abcdefg" }, info as GraphQLResolveInfo, ctx)) as GraphQLError).message,
    ).toBe("Invalid connection argument combination. `after` must be used in combination with `first`.");
  });

  test("when `after` and `last` are provided", async () => {
    const info = {};

    expect(
      ((await validateCursor({ after: "abcdefg", last: 5 }, info as GraphQLResolveInfo, ctx)) as GraphQLError).message,
    ).toBe("Invalid connection argument combination. `after` cannot be used in combination with `last`.");
  });

  test("when `before` is provided but `last` is NOT", async () => {
    const info = {};

    expect(
      ((await validateCursor({ before: "abcdefg" }, info as GraphQLResolveInfo, ctx)) as GraphQLError).message,
    ).toBe("Invalid connection argument combination. `before` must be used in combination with `last`.");
  });

  test("when `before` and `first` are provided", async () => {
    const info = {};

    expect(
      ((await validateCursor({ before: "abcdefg", first: 5 }, info as GraphQLResolveInfo, ctx)) as GraphQLError)
        .message,
    ).toBe("Invalid connection argument combination. `before` cannot be used in combination with `first`.");
  });

  test("when a cursor was not previously provided", async () => {
    const args = { after: "abcdefg", first: 5, query: "Hello world!" };
    const info = {};

    expect(((await validateCursor(args, info as GraphQLResolveInfo, ctx)) as GraphQLError).message).toBe(
      "Curser cannot be supplied without previously being provided.",
    );
  });

  test("when a cursor could not be found", async () => {
    await ctx.cursorCache.set(`${ctx.groupCursor}-metadata`, { totalPages: 10, totalResults: 100 });
    const args = { after: "abcdefg", first: 5, query: "Hello world!" };
    const info = {};

    expect(((await validateCursor(args, info as GraphQLResolveInfo, ctx)) as GraphQLError).message).toBe(
      "The cursor abcdefg could not be found.",
    );
  });

  test("when a cursor is the last", async () => {
    await ctx.cursorCache.set(`${ctx.groupCursor}-metadata`, { totalPages: 6, totalResults: 53 });
    await ctx.cursorCache.set("abcdefg", { index: 2, page: 6 });
    const args = { after: "abcdefg", first: 5, query: "Hello world!" };
    const info = {};

    expect(((await validateCursor(args, info as GraphQLResolveInfo, ctx)) as GraphQLError).message).toBe(
      "The cursor abcdefg is the last, you cannot go forward any further.",
    );
  });

  test("when a cursor is the first", async () => {
    await ctx.cursorCache.set(`${ctx.groupCursor}-metadata`, { totalPages: 6, totalResults: 53 });
    await ctx.cursorCache.set("abcdefg", { index: 0, page: 1 });
    const args = { before: "abcdefg", last: 5, query: "Hello world!" };
    const info = {};

    expect(((await validateCursor(args, info as GraphQLResolveInfo, ctx)) as GraphQLError).message).toBe(
      "The cursor abcdefg is the first, you cannot go backward any further.",
    );
  });

  test("when `after` and `first` are provided and the cursor is not invalid", async () => {
    await ctx.cursorCache.set(`${ctx.groupCursor}-metadata`, { totalPages: 6, totalResults: 53 });
    await ctx.cursorCache.set("abcdefg", { index: 0, page: 2 });
    const args = { after: "abcdefg", first: 5, query: "Hello world!" };
    const info = {};
    expect(await validateCursor(args, info as GraphQLResolveInfo, ctx)).toBeUndefined();
  });

  test("when `before` and `last` are provided and the cursor is not invalid", async () => {
    await ctx.cursorCache.set(`${ctx.groupCursor}-metadata`, { totalPages: 6, totalResults: 53 });
    await ctx.cursorCache.set("abcdefg", { index: 0, page: 2 });
    const args = { before: "abcdefg", last: 5, query: "Hello world!" };
    const info = {};
    expect(await validateCursor(args, info as GraphQLResolveInfo, ctx)).toBeUndefined();
  });
});
