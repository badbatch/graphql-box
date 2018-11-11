import { getRequestContext, githubIntrospection, githubQueries } from "@handl/test-utils";
import { IntrospectionQuery } from "graphql";
import { parserDefs, RequestParser } from ".";
import { DEFAULT_TYPE_ID_KEY } from "./consts";

describe("@handl/request-parser", () => {
  let requestParser: parserDefs.RequestParser;

  beforeAll(async () => {
    requestParser = await RequestParser.init({
      introspection: githubIntrospection as IntrospectionQuery,
      typeIDKey: DEFAULT_TYPE_ID_KEY,
    });
  });

  describe("when a query with a variable is passed in", () => {
    let updatedRequest: parserDefs.UpdateRequestResult;

    beforeAll(async () => {
      const options = { variables: { login: "facebook" } };
      updatedRequest = await requestParser.updateRequest(githubQueries.withVariable, options, getRequestContext());
    });

    it("then the function should return the query with the variable embedded in it", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });
  });
});
