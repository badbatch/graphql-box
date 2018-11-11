import { IntrospectionQuery } from "graphql";
import { singleQuery, updatedSingleQuery } from "../../../../test/data/graphql/github/requests";
import { getRequestContext } from "../../../../test/helpers";
import introspection from "../../../../test/introspections/github/index.json";
import { parserDefs, RequestParser } from "../../src";
import { DEFAULT_TYPE_ID_KEY } from "../../src/consts";

describe("request parser module", () => {
  let requestParser: parserDefs.RequestParser;

  beforeAll(async () => {
    requestParser = await RequestParser.init({
      introspection: introspection as unknown as IntrospectionQuery,
      typeIDKey: DEFAULT_TYPE_ID_KEY,
    });
  });

  describe("when a query with variables is passed in", () => {
    let updatedRequest: parserDefs.UpdateRequestResult;

    beforeAll(async () => {
      updatedRequest = await requestParser.updateRequest(singleQuery, {}, getRequestContext());
    });

    it("then the function should return the query with the variables embedded in it", () => {
      expect(updatedRequest).toBe(updatedSingleQuery);
    });
  });
});
