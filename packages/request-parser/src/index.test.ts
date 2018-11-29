import { coreDefs } from "@handl/core";
import { getRequestContext, githubIntrospection, githubMutations, githubQueries } from "@handl/test-utils";
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

  describe("when a query without a variable is passed in", () => {
    let updatedRequest: parserDefs.UpdateRequestResult;
    let requestContext: coreDefs.RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueries.withoutVariable;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("then the parser should return the query unchanged", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("then the parser should update the request context with the correct data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("when a query with an operation name is passed in", () => {
    let updatedRequest: parserDefs.UpdateRequestResult;
    let requestContext: coreDefs.RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueries.withOperationName;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("then the parser should return the query with the operation name retained", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("then the parser should update the request context with the correct data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("when a query with a variable is passed in", () => {
    let updatedRequest: parserDefs.UpdateRequestResult;
    let requestContext: coreDefs.RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueries.withVariable;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("then the parser should return the query with the variable embedded in it", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("then the parser should update the request context with the correct data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("when a query with multiple variables are passed in", () => {
    let updatedRequest: parserDefs.UpdateRequestResult;
    let requestContext: coreDefs.RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueries.withVariables;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("then the parser should return the query with the variables embedded in it", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("then the parser should update the request context with the correct data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("when a query with an enum variable is passed in", () => {
    let updatedRequest: parserDefs.UpdateRequestResult;
    let requestContext: coreDefs.RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueries.withEnumVariable;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("then the parser should return the query with the enum variable embedded in it", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("then the parser should update the request context with the correct data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("when a query with a directive is passed in", () => {
    let updatedRequest: parserDefs.UpdateRequestResult;
    let requestContext: coreDefs.RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueries.withDirective;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("then the parser should return the query with the directive retained", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("then the parser should update the request context with the correct data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("when a query with an inline fragment is passed in", () => {
    let updatedRequest: parserDefs.UpdateRequestResult;
    let requestContext: coreDefs.RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueries.withInlineFragment;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("then the parser should return the query with the inline fragment retained", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("then the parser should update the request context with the correct data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("when a query with a fragment spread is passed in", () => {
    let updatedRequest: parserDefs.UpdateRequestResult;
    let requestContext: coreDefs.RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueries.withFragmentSpread;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("then the parser should return the query with the fragment spread embedded in it", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("then the parser should update the request context with the correct data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("when a query with a fragment option is passed in", () => {
    let updatedRequest: parserDefs.UpdateRequestResult;
    let requestContext: coreDefs.RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueries.withFragmentOption;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("then the parser should return the query with the fragment option embedded in it", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("then the parser should update the request context with the correct data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("when a mutation with an input type variable is passed in", () => {
    let updatedRequest: parserDefs.UpdateRequestResult;
    let requestContext: coreDefs.RequestContext;

    beforeAll(async () => {
      const { options, request } = githubMutations.withInputType;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("then the parser should return the query with the input type variable embedded in it", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("then the parser should update the request context with the correct data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });
});
