import { getRequestContext, getRequestData, parsedRequests, requestFieldTypeMaps } from '@graphql-box/test-utils';
import { type ActiveQueryData } from '../types.ts';
import { isDataRequestedInActiveQuery } from './isDataRequestedInActiveQuery.ts';

describe('isDataRequestedInActiveQuery', () => {
  describe('when data requested is not in active query', () => {
    it('should return undefined', () => {
      const aciveQueryData = {
        context: getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
        requestData: getRequestData(parsedRequests.singleTypeQuery),
      } as unknown as ActiveQueryData;

      const newRequestData = getRequestData(parsedRequests.nestedTypeQuery);
      const newRequestContext = getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery });
      expect(isDataRequestedInActiveQuery([aciveQueryData], newRequestData, newRequestContext)).toBeUndefined();
    });
  });

  describe('when data requested is in active query', () => {
    describe('when arguments do not match', () => {
      it('should return undefined', () => {
        const aciveQueryData = {
          context: getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
          requestData: getRequestData(parsedRequests.nestedTypeQuery),
        } as unknown as ActiveQueryData;

        const newRequestData = getRequestData(parsedRequests.singleTypeQuery.replace('facebook', 'google'));
        const newRequestContext = getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery });
        expect(isDataRequestedInActiveQuery([aciveQueryData], newRequestData, newRequestContext)).toBeUndefined();
      });
    });

    describe('when there are no fragments or directives or aliases in the new query', () => {
      it('should return the matching active query hash', () => {
        const aciveQueryData = {
          context: getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
          requestData: getRequestData(parsedRequests.nestedTypeQuery),
        } as unknown as ActiveQueryData;

        const newRequestData = getRequestData(parsedRequests.singleTypeQuery);
        const newRequestContext = getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery });

        expect(isDataRequestedInActiveQuery([aciveQueryData], newRequestData, newRequestContext)).toBe(
          aciveQueryData.requestData.hash
        );
      });
    });

    describe('when there is an alias in the new query', () => {
      it('should return the matching active query hash', () => {
        const aciveQueryData = {
          context: getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
          requestData: getRequestData(parsedRequests.nestedTypeQuery),
        } as unknown as ActiveQueryData;

        const newRequestData = getRequestData(parsedRequests.singleTypeQueryWithAlias);
        const newRequestContext = getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery });

        expect(isDataRequestedInActiveQuery([aciveQueryData], newRequestData, newRequestContext)).toBe(
          aciveQueryData.requestData.hash
        );
      });
    });

    describe('when there is a directive in the new query', () => {
      describe('when the directives do not match', () => {
        it('should return undefined', () => {
          const aciveQueryData = {
            context: getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
            requestData: getRequestData(parsedRequests.nestedTypeQuery),
          } as unknown as ActiveQueryData;

          const newRequestData = getRequestData(parsedRequests.singleTypeQueryWithDirective);

          const newRequestContext = getRequestContext({
            fieldTypeMap: requestFieldTypeMaps.singleTypeQueryWithDirective,
          });

          expect(isDataRequestedInActiveQuery([aciveQueryData], newRequestData, newRequestContext)).toBeUndefined();
        });
      });

      describe('when the directives match', () => {
        it('should return the matching active query hash', () => {
          const aciveQueryData = {
            context: getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQueryWithDirectives }),
            requestData: getRequestData(parsedRequests.nestedTypeQueryWithDirectives),
          } as unknown as ActiveQueryData;

          const newRequestData = getRequestData(parsedRequests.singleTypeQueryWithDirective);

          const newRequestContext = getRequestContext({
            fieldTypeMap: requestFieldTypeMaps.singleTypeQueryWithDirective,
          });

          expect(isDataRequestedInActiveQuery([aciveQueryData], newRequestData, newRequestContext)).toBe(
            aciveQueryData.requestData.hash
          );
        });
      });
    });

    describe('when there is a inline fragment in the new query', () => {
      it('should return the matching active query hash', () => {
        const aciveQueryData = {
          context: getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
          requestData: getRequestData(parsedRequests.nestedTypeQuery),
        } as unknown as ActiveQueryData;

        const newRequestData = getRequestData(parsedRequests.singleTypeQueryWithInlineFragment);
        const newRequestContext = getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery });

        expect(isDataRequestedInActiveQuery([aciveQueryData], newRequestData, newRequestContext)).toBe(
          aciveQueryData.requestData.hash
        );
      });
    });

    describe('when there is a fragment spread in the new query', () => {
      it('should return the matching active query hash', () => {
        const aciveQueryData = {
          context: getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
          requestData: getRequestData(parsedRequests.nestedTypeQuery),
        } as unknown as ActiveQueryData;

        const newRequestData = getRequestData(parsedRequests.singleTypeQueryWithFragmentSpread);
        const newRequestContext = getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery });

        expect(isDataRequestedInActiveQuery([aciveQueryData], newRequestData, newRequestContext)).toBe(
          aciveQueryData.requestData.hash
        );
      });
    });

    describe('when there is are fragments in the active query', () => {
      it('should return the matching active query hash', () => {
        const aciveQueryData = {
          context: getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
          requestData: getRequestData(parsedRequests.nestedTypeQueryWithFragments),
        } as unknown as ActiveQueryData;

        const newRequestData = getRequestData(parsedRequests.nestedTypeQueryBasic);
        const newRequestContext = getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery });

        expect(isDataRequestedInActiveQuery([aciveQueryData], newRequestData, newRequestContext)).toBe(
          aciveQueryData.requestData.hash
        );
      });
    });
  });
});
