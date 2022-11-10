import { MUTATION, RequestContext, SUBSCRIPTION } from "@graphql-box/core";
import {
  getRequestContext,
  githubIntrospection,
  requestsAndOptions,
  schemaResolvers,
  schemaTypeDefs,
  theMovieDbIntrospection,
} from "@graphql-box/test-utils";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { IntrospectionQuery } from "graphql";
import RequestParser, { RequestParserDef, UpdateRequestResult } from ".";

describe("@graphql-box/request-parser >>", () => {
  let requestContext: RequestContext;
  let requestParser: RequestParserDef;
  let updatedRequest: UpdateRequestResult | undefined;

  describe("query >> no variable >>", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithoutVariable;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> with default", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithDefault;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> with number default", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithNumberDefault;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> operation name >>", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithOperationName;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> variable", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithVariable;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> variable with default", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithVariableWithDefault;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> multiple variables >>", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithVariables;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> enum variable >>", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithEnumVariable;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> directive", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithDirective;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> inline fragment >>", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithInlineFragment;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> inline fragments >> union type >>", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithUnionInlineFragments;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> fragment spread >>", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithFragmentSpread;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> fragment spreads >> within fragment spreads >>", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: (theMovieDbIntrospection as unknown) as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.getMoviePreviewQuery;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> union type inline fragments >> fragment spread >>", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithUnionInlineFragmentsAndFragmentSpread;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> fragment option >>", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithFragmentOption;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("query >> defer >>", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithDefer;
      requestContext = getRequestContext();
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("mutation >> input type variable >>", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.nestedInterfaceMutation;
      requestContext = getRequestContext({ operation: MUTATION });
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("subscription >>", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        schema: makeExecutableSchema({
          parseOptions: { enableDeferStream: true },
          resolvers: schemaResolvers,
          typeDefs: schemaTypeDefs,
          updateResolversInPlace: true,
        }),
      });

      const { options, request } = requestsAndOptions.nestedTypeSubscription;
      requestContext = getRequestContext({ operation: SUBSCRIPTION });
      updatedRequest = await requestParser.updateRequest(request, options, requestContext);
    });

    it("correct request", () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it("correct context data", () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe("maxFieldDepth >> exceeded >>", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
        maxFieldDepth: 2,
      });

      requestContext = getRequestContext();
    });

    it("throws correct error", async () => {
      const { options, request } = requestsAndOptions.queryWithDefer;

      await expect(requestParser.updateRequest(request, options, requestContext)).rejects.toThrow(
        "@graphql-box/request-parser >> request field depth of 7 exceeded max field depth of 2",
      );
    });
  });

  describe("maxTypeComplexity >> exceeded >>", () => {
    beforeAll(async () => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
        maxTypeComplexity: 9,
        typeComplexityMap: {
          LicenseRule: 3,
          Organization: 1,
          Repository: 1,
          RepositoryConnection: 5,
        },
      });

      requestContext = getRequestContext();
    });

    it("throws correct error", async () => {
      const { options, request } = requestsAndOptions.queryWithDefer;

      await expect(requestParser.updateRequest(request, options, requestContext)).rejects.toThrow(
        "@graphql-box/request-parser >> request type complexity of 10 exceeded max type complexity of 9",
      );
    });
  });
});
