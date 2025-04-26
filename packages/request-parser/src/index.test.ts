import { type RequestContext } from '@graphql-box/core';
import {
  getRequestContext,
  githubIntrospection,
  requestsAndOptions,
  resolvers,
  theMovieDbIntrospection,
  typeDefs,
} from '@graphql-box/test-utils';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { expect } from '@jest/globals';
import { type IntrospectionQuery, OperationTypeNode } from 'graphql';
import { RequestParser, type RequestParserDef, type UpdateRequestResult } from './index.ts';

describe('@graphql-box/request-parser >>', () => {
  let requestContext: RequestContext;
  let requestParser: RequestParserDef;
  let updatedRequest: UpdateRequestResult | undefined;

  describe('query >> no variable >>', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithoutVariable;
      requestContext = getRequestContext();
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('query >> with default', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithDefault;
      requestContext = getRequestContext();
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('query >> with number default', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithNumberDefault;
      requestContext = getRequestContext();
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('query >> operation name >>', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithOperationName;
      requestContext = getRequestContext();
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('query >> variable', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithVariable;
      requestContext = getRequestContext();
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('query >> variable with default', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithVariableWithDefault;
      requestContext = getRequestContext();
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('query >> multiple variables >>', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithVariables;
      requestContext = getRequestContext();
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('query >> enum variable >>', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithEnumVariable;
      requestContext = getRequestContext();
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('query >> directive', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithDirective;
      requestContext = getRequestContext();
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('query >> inline fragment >>', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithInlineFragment;
      requestContext = getRequestContext();
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('query >> inline fragments >> union type >>', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithUnionInlineFragments;
      requestContext = getRequestContext();
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('query >> fragment spread >>', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithFragmentSpread;
      requestContext = getRequestContext();
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('query >> fragment spreads >> within fragment spreads >>', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: theMovieDbIntrospection as unknown as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.getMoviePreviewQuery;
      requestContext = getRequestContext({ deprecated: { experimentalDeferStreamSupport: true } });
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('query >> union type inline fragments >> fragment spread >>', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithUnionInlineFragmentsAndFragmentSpread;
      requestContext = getRequestContext();
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('query >> fragment option >>', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.queryWithFragmentOption;
      requestContext = getRequestContext();
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('query >> defer >>', () => {
    describe('when experimentalDeferStreamSupport flag is true >>', () => {
      beforeAll(() => {
        updatedRequest = undefined;

        requestParser = new RequestParser({
          introspection: githubIntrospection as IntrospectionQuery,
        });

        const { options, request } = requestsAndOptions.queryWithDefer;
        requestContext = getRequestContext({ deprecated: { experimentalDeferStreamSupport: true } });
        updatedRequest = requestParser.updateRequest(request, options, requestContext);
      });

      it('correct request', () => {
        expect(updatedRequest?.request).toMatchSnapshot();
      });

      it('correct context data', () => {
        expect(requestContext).toMatchSnapshot();
      });
    });

    describe('when experimentalDeferStreamSupport flag is false >>', () => {
      beforeAll(() => {
        updatedRequest = undefined;

        requestParser = new RequestParser({
          introspection: githubIntrospection as IntrospectionQuery,
        });

        requestContext = getRequestContext();
      });

      it('throws correct error', () => {
        const { options, request } = requestsAndOptions.queryWithDefer;

        expect(() => requestParser.updateRequest(request, options, requestContext)).toThrow(
          '@graphql-box/request-parser >> to use defer/stream directives, please set the experimentalDeferStreamSupport flag to true',
        );
      });
    });
  });

  describe('mutation >> input type variable >>', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });

      const { options, request } = requestsAndOptions.nestedInterfaceMutation;
      requestContext = getRequestContext({ data: { operation: OperationTypeNode.MUTATION } });
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('subscription >>', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        schema: makeExecutableSchema({
          resolvers,
          typeDefs,
          updateResolversInPlace: true,
        }),
      });

      const { options, request } = requestsAndOptions.nestedTypeSubscription;
      requestContext = getRequestContext({ data: { operation: OperationTypeNode.SUBSCRIPTION } });
      updatedRequest = requestParser.updateRequest(request, options, requestContext);
    });

    it('correct request', () => {
      expect(updatedRequest?.request).toMatchSnapshot();
    });

    it('correct context data', () => {
      expect(requestContext).toMatchSnapshot();
    });
  });

  describe('maxFieldDepth >> exceeded >>', () => {
    beforeAll(() => {
      updatedRequest = undefined;

      requestParser = new RequestParser({
        introspection: githubIntrospection as IntrospectionQuery,
        maxFieldDepth: 2,
      });

      requestContext = getRequestContext({ deprecated: { experimentalDeferStreamSupport: true } });
    });

    it('throws correct error', () => {
      const { options, request } = requestsAndOptions.queryWithDefer;

      expect(() => requestParser.updateRequest(request, options, requestContext)).toThrow(
        '@graphql-box/request-parser >> request field depth of 7 exceeded max field depth of 2',
      );
    });
  });

  describe('maxTypeComplexity >> exceeded >>', () => {
    beforeAll(() => {
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

      requestContext = getRequestContext({ deprecated: { experimentalDeferStreamSupport: true } });
    });

    it('throws correct error', () => {
      const { options, request } = requestsAndOptions.queryWithDefer;

      expect(() => requestParser.updateRequest(request, options, requestContext)).toThrow(
        '@graphql-box/request-parser >> request type complexity of 10 exceeded max type complexity of 9',
      );
    });
  });
});
