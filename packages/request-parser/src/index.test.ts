import { DEFAULT_TYPE_ID_KEY, MUTATION, RequestContext, SUBSCRIPTION } from "@handl/core";
import {
  getRequestContext,
  githubIntrospection,
  requestsAndOptions,
  schemaResolvers,
  schemaTypeDefs,
} from "@handl/test-utils";
import { IntrospectionQuery } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import { RequestParser, RequestParserDef, UpdateRequestResult } from ".";

describe("@handl/request-parser >>", () => {
  let requestContext: RequestContext;
  let requestParser: RequestParserDef;
  let updatedRequest: UpdateRequestResult;

  describe("query >> no variable >>", () => {
    beforeAll(async () => {
      requestParser = await RequestParser.init({
        introspection: githubIntrospection as IntrospectionQuery,
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const { options, request } = requestsAndOptions.queryWithoutVariable;
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
    beforeAll(async () => {
      requestParser = await RequestParser.init({
        introspection: githubIntrospection as IntrospectionQuery,
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const { options, request } = requestsAndOptions.queryWithOperationName;
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
    beforeAll(async () => {
      requestParser = await RequestParser.init({
        introspection: githubIntrospection as IntrospectionQuery,
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const { options, request } = requestsAndOptions.queryWithVariable;
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
    beforeAll(async () => {
      requestParser = await RequestParser.init({
        introspection: githubIntrospection as IntrospectionQuery,
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const { options, request } = requestsAndOptions.queryWithVariables;
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
    beforeAll(async () => {
      requestParser = await RequestParser.init({
        introspection: githubIntrospection as IntrospectionQuery,
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const { options, request } = requestsAndOptions.queryWithEnumVariable;
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
    beforeAll(async () => {
      requestParser = await RequestParser.init({
        introspection: githubIntrospection as IntrospectionQuery,
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const { options, request } = requestsAndOptions.queryWithDirective;
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
    beforeAll(async () => {
      requestParser = await RequestParser.init({
        introspection: githubIntrospection as IntrospectionQuery,
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const { options, request } = requestsAndOptions.queryWithInlineFragment;
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
    beforeAll(async () => {
      requestParser = await RequestParser.init({
        introspection: githubIntrospection as IntrospectionQuery,
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const { options, request } = requestsAndOptions.queryWithUnionInlineFragments;
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
    beforeAll(async () => {
      requestParser = await RequestParser.init({
        introspection: githubIntrospection as IntrospectionQuery,
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const { options, request } = requestsAndOptions.queryWithFragmentSpread;
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
    beforeAll(async () => {
      requestParser = await RequestParser.init({
        introspection: githubIntrospection as IntrospectionQuery,
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const { options, request } = requestsAndOptions.queryWithFragmentOption;
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
    beforeAll(async () => {
      requestParser = await RequestParser.init({
        introspection: githubIntrospection as IntrospectionQuery,
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const { options, request } = requestsAndOptions.nestedInterfaceMutation;
      requestContext = getRequestContext({ operation: MUTATION });
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("subscription >>", () => {
    beforeAll(async () => {
      requestParser = await RequestParser.init({
        schema: makeExecutableSchema({ typeDefs: schemaTypeDefs, resolvers: schemaResolvers }),
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const { options, request } = requestsAndOptions.nestedTypeSubscription;
      requestContext = getRequestContext({ operation: SUBSCRIPTION });
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
