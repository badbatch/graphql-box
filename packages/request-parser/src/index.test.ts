import { RequestContext } from "@handl/core";
import {
  getRequestContext,
  githubIntrospection,
  githubMutationsAndOptions,
  githubQueriesAndOptions,
} from "@handl/test-utils";
import { IntrospectionQuery } from "graphql";
import { RequestParser, RequestParserDef, UpdateRequestResult } from ".";
import { DEFAULT_TYPE_ID_KEY } from "./consts";

describe("@handl/request-parser", () => {
  let requestParser: RequestParserDef;

  beforeAll(async () => {
    requestParser = await RequestParser.init({
      introspection: githubIntrospection as IntrospectionQuery,
      typeIDKey: DEFAULT_TYPE_ID_KEY,
    });
  });

  describe("when a query without a variable is passed in", () => {
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withoutVariable;
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
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withOperationName;
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
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withVariable;
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
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withVariables;
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
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withEnumVariable;
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
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withDirective;
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
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withInlineFragment;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("then the parser should return the query with the inline fragment embedded in it", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("then the parser should update the request context with the correct data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("when a query with inline fragments for a union type are passed in", () => {
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withUnionInlineFragments;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("then the parser should return the query with the inline fragments retained", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("then the parser should update the request context with the correct data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("when a query with a fragment spread is passed in", () => {
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withFragmentSpread;
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
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withFragmentOption;
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
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubMutationsAndOptions.withInputType;
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
