import { type ResponseData } from '@graphql-box/core';
import {
  getRequestContext,
  getRequestData,
  parsedRequests,
  requestFieldTypeMaps,
  responses,
} from '@graphql-box/test-utils';
import { expect } from '@jest/globals';
import { filterResponseData } from './filterResponseData.ts';

describe('filterResponseData', () => {
  describe('when there are no fragments or directives or aliases in the pending query', () => {
    it('should return the correct data', () => {
      const pendingRequestData = getRequestData(parsedRequests.singleTypeQuery);
      const pendingRequestContext = getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery });
      const activeRequestData = getRequestData(parsedRequests.nestedTypeQuery);
      const activeRequestContext = getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery });

      const responseData = filterResponseData(
        pendingRequestData,
        activeRequestData,
        responses.nestedTypeQuery as ResponseData,
        {
          active: activeRequestContext,
          pending: pendingRequestContext,
        }
      );

      expect(responseData).toMatchSnapshot();
    });
  });

  describe('when there is an alias in the pending query', () => {
    it('should return the correct data', () => {
      const pendingRequestData = getRequestData(parsedRequests.singleTypeQueryWithAlias);
      const pendingRequestContext = getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery });
      const activeRequestData = getRequestData(parsedRequests.nestedTypeQuery);
      const activeRequestContext = getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery });

      const responseData = filterResponseData(
        pendingRequestData,
        activeRequestData,
        responses.nestedTypeQuery as ResponseData,
        {
          active: activeRequestContext,
          pending: pendingRequestContext,
        }
      );

      expect(responseData).toMatchSnapshot();
    });
  });

  describe('when there is a directive in the pending query', () => {
    describe('when the directives do not match', () => {
      it('should return the correct data', () => {
        const pendingRequestData = getRequestData(parsedRequests.singleTypeQueryWithDirective);

        const pendingRequestContext = getRequestContext({
          fieldTypeMap: requestFieldTypeMaps.singleTypeQueryWithDirective,
        });

        const activeRequestData = getRequestData(parsedRequests.nestedTypeQuery);
        const activeRequestContext = getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery });

        const responseData = filterResponseData(
          pendingRequestData,
          activeRequestData,
          responses.nestedTypeQuery as ResponseData,
          {
            active: activeRequestContext,
            pending: pendingRequestContext,
          }
        );

        expect(responseData).toMatchSnapshot();
      });
    });

    describe('when the directives match', () => {
      it('should return the correct data', () => {
        const pendingRequestData = getRequestData(parsedRequests.singleTypeQueryWithDirective);

        const pendingRequestContext = getRequestContext({
          fieldTypeMap: requestFieldTypeMaps.singleTypeQueryWithDirective,
        });

        const activeRequestData = getRequestData(parsedRequests.nestedTypeQueryWithDirectives);

        const activeRequestContext = getRequestContext({
          fieldTypeMap: requestFieldTypeMaps.nestedTypeQueryWithDirectives,
        });

        const responseData = filterResponseData(
          pendingRequestData,
          activeRequestData,
          responses.nestedTypeQuery as ResponseData,
          {
            active: activeRequestContext,
            pending: pendingRequestContext,
          }
        );

        expect(responseData).toMatchSnapshot();
      });
    });
  });

  describe('when there is a inline fragment in the pending query', () => {
    it('should return the correct data', () => {
      const pendingRequestData = getRequestData(parsedRequests.singleTypeQueryWithInlineFragment);

      const pendingRequestContext = getRequestContext({
        fieldTypeMap: requestFieldTypeMaps.singleTypeQuery,
      });

      const activeRequestData = getRequestData(parsedRequests.nestedTypeQuery);

      const activeRequestContext = getRequestContext({
        fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery,
      });

      const responseData = filterResponseData(
        pendingRequestData,
        activeRequestData,
        responses.nestedTypeQuery as ResponseData,
        {
          active: activeRequestContext,
          pending: pendingRequestContext,
        }
      );

      expect(responseData).toMatchSnapshot();
    });
  });

  describe('when there is a fragment spread in the new query', () => {
    it('should return the correct data', () => {
      const pendingRequestData = getRequestData(parsedRequests.singleTypeQueryWithFragmentSpread);

      const pendingRequestContext = getRequestContext({
        fieldTypeMap: requestFieldTypeMaps.singleTypeQuery,
      });

      const activeRequestData = getRequestData(parsedRequests.nestedTypeQuery);

      const activeRequestContext = getRequestContext({
        fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery,
      });

      const responseData = filterResponseData(
        pendingRequestData,
        activeRequestData,
        responses.nestedTypeQuery as ResponseData,
        {
          active: activeRequestContext,
          pending: pendingRequestContext,
        }
      );

      expect(responseData).toMatchSnapshot();
    });
  });

  describe('when there is are fragments in the active query', () => {
    it('should return the correct data', () => {
      const pendingRequestData = getRequestData(parsedRequests.nestedTypeQueryBasic);

      const pendingRequestContext = getRequestContext({
        fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery,
      });

      const activeRequestData = getRequestData(parsedRequests.nestedTypeQueryWithFragments);

      const activeRequestContext = getRequestContext({
        fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery,
      });

      const responseData = filterResponseData(
        pendingRequestData,
        activeRequestData,
        responses.nestedTypeQuery as ResponseData,
        {
          active: activeRequestContext,
          pending: pendingRequestContext,
        }
      );

      expect(responseData).toMatchSnapshot();
    });
  });
});
