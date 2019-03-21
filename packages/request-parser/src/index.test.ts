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

describe("@handl/request-parser >>", () => {
  let requestParser: RequestParserDef;

  beforeAll(async () => {
    requestParser = await RequestParser.init({
      introspection: githubIntrospection as IntrospectionQuery,
      typeIDKey: DEFAULT_TYPE_ID_KEY,
    });
  });

  describe("query >> no variable >>", () => {
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withoutVariable;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> operation name >>", () => {
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withOperationName;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> variable", () => {
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withVariable;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> multiple variables >>", () => {
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withVariables;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> enum variable >>", () => {
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withEnumVariable;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> directive", () => {
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withDirective;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> inline fragment >>", () => {
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withInlineFragment;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> inline fragments >> union type >>", () => {
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withUnionInlineFragments;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> fragment spread >>", () => {
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withFragmentSpread;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> fragment option >>", () => {
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubQueriesAndOptions.withFragmentOption;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("mutation >> input type variable >>", () => {
    let updatedRequest: UpdateRequestResult;
    let requestContext: RequestContext;

    beforeAll(async () => {
      const { options, request } = githubMutationsAndOptions.withInputType;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });
});
