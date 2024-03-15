import { Core } from '@cachemap/core';
import { init as map } from '@cachemap/map';
import {
  DEFAULT_TYPE_ID_KEY,
  type RawResponseDataWithMaybeCacheMetadata,
  type RequestData,
  type ResponseData,
} from '@graphql-box/core';
import { rehydrateCacheMetadata } from '@graphql-box/helpers';
import {
  getRequestContext,
  getRequestData,
  parsedRequests,
  requestFieldTypeMaps,
  responses,
} from '@graphql-box/test-utils';
import { expect, jest } from '@jest/globals';
import { OperationTypeNode } from 'graphql';
import { type AnalyzeQueryResult, CacheManager, type CacheManagerDef } from './index.ts';

describe('@graphql-box/cache-manager >>', () => {
  const realDateNow = Date.now.bind(global.Date);
  let cacheManager: CacheManagerDef;

  beforeAll(() => {
    globalThis.Date.now = jest.fn<() => number>().mockReturnValue(Date.parse('June 6, 1979 GMT'));
  });

  afterAll(() => {
    global.Date.now = realDateNow;
  });

  describe('cacheResponse >>', () => {
    let responseData: ResponseData | undefined;
    let requestData: RequestData;

    describe('mutation >> nested interface >>', () => {
      describe('cascading cache control >>', () => {
        beforeAll(() => {
          responseData = undefined;

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            cascadeCacheControl: true,
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          requestData = getRequestData(parsedRequests.nestedInterfaceMutation);

          responseData = cacheManager.cacheResponse(
            requestData,
            responses.nestedInterfaceMutation,
            {},
            getRequestContext({
              fieldTypeMap: requestFieldTypeMaps.nestedInterfaceMutation,
              operation: OperationTypeNode.MUTATION,
            })
          );
        });

        it('correct response data', () => {
          expect(responseData).toMatchSnapshot();
        });

        it('correct cache data', async () => {
          await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
        });
      });

      describe('type cache directives >>', () => {
        beforeAll(() => {
          responseData = undefined;

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            typeCacheDirectives: {
              AddStarPayload: 'no-cache, no-store',
              StargazerConnection: 'public, max-age=1',
              StargazerEdge: 'public, max-age=1',
              Starrable: 'public, max-age=10',
              User: 'public, max-age=5',
            },
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          requestData = getRequestData(parsedRequests.nestedInterfaceMutation);

          responseData = cacheManager.cacheResponse(
            requestData,
            responses.nestedInterfaceMutation,
            {},
            getRequestContext({
              fieldTypeMap: requestFieldTypeMaps.nestedInterfaceMutation,
              operation: OperationTypeNode.MUTATION,
            })
          );
        });

        it('correct response data', () => {
          expect(responseData).toMatchSnapshot();
        });

        it('correct cache data', async () => {
          await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
        });
      });
    });

    describe('subscription >> nested type >>', () => {
      describe('cascading cache control >>', () => {
        beforeAll(() => {
          responseData = undefined;

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            cascadeCacheControl: true,
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          requestData = getRequestData(parsedRequests.nestedTypeSubscription);

          responseData = cacheManager.cacheResponse(
            requestData,
            responses.nestedTypeSubscription,
            {},
            getRequestContext({
              fieldTypeMap: requestFieldTypeMaps.nestedTypeSubscription,
              operation: OperationTypeNode.SUBSCRIPTION,
            })
          );
        });

        it('correct response data', () => {
          expect(responseData).toMatchSnapshot();
        });

        it('correct cache data', async () => {
          await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
        });
      });

      describe('type cache directives >>', () => {
        beforeAll(() => {
          responseData = undefined;

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            typeCacheDirectives: {
              Email: 'public, max-age=5',
              Inbox: 'public, max-age=1',
            },
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          requestData = getRequestData(parsedRequests.nestedTypeSubscription);

          responseData = cacheManager.cacheResponse(
            requestData,
            responses.nestedTypeSubscription,
            {},
            getRequestContext({
              fieldTypeMap: requestFieldTypeMaps.nestedTypeSubscription,
              operation: OperationTypeNode.SUBSCRIPTION,
            })
          );
        });

        it('correct response data', () => {
          expect(responseData).toMatchSnapshot();
        });

        it('correct cache data', async () => {
          await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
        });
      });
    });
  });

  describe('cacheQuery >>', () => {
    let responseData: ResponseData | undefined;
    let requestData: RequestData;

    describe('not filtered >>', () => {
      describe('single type >>', () => {
        describe('cascading cache control >>', () => {
          beforeAll(() => {
            responseData = undefined;

            cacheManager = new CacheManager({
              cache: new Core({
                name: 'cachemap',
                store: map(),
                type: 'someType',
              }),
              cascadeCacheControl: true,
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.singleTypeQuery);

            responseData = cacheManager.cacheQuery(
              requestData,
              requestData,
              responses.singleTypeQuery,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery })
            );
          });

          it('correct response data', () => {
            expect(responseData).toMatchSnapshot();
          });

          it('correct cache data', async () => {
            await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
          });
        });

        describe('type cache directives >>', () => {
          beforeAll(() => {
            responseData = undefined;

            cacheManager = new CacheManager({
              cache: new Core({
                name: 'cachemap',
                store: map(),
                type: 'someType',
              }),
              typeCacheDirectives: {
                Organization: 'public, max-age=1',
              },
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.singleTypeQuery);

            responseData = cacheManager.cacheQuery(
              requestData,
              requestData,
              responses.singleTypeQuery,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery })
            );
          });

          it('correct response data', () => {
            expect(responseData).toMatchSnapshot();
          });

          it('correct cache data', async () => {
            await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
          });
        });
      });

      describe('nested type with edges >>', () => {
        describe('cascading cache control >>', () => {
          beforeAll(() => {
            responseData = undefined;

            cacheManager = new CacheManager({
              cache: new Core({
                name: 'cachemap',
                store: map(),
                type: 'someType',
              }),
              cascadeCacheControl: true,
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.nestedTypeQuery);

            responseData = cacheManager.cacheQuery(
              requestData,
              requestData,
              responses.nestedTypeQuery,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery })
            );
          });

          it('correct response data', () => {
            expect(responseData).toMatchSnapshot();
          });

          it('correct cache data', async () => {
            await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
          });
        });

        describe('type cache directives >>', () => {
          beforeAll(() => {
            responseData = undefined;

            cacheManager = new CacheManager({
              cache: new Core({
                name: 'cachemap',
                store: map(),
                type: 'someType',
              }),
              typeCacheDirectives: {
                Organization: 'public, max-age=3',
                Repository: 'public, max-age=2',
                RepositoryConnection: 'public, max-age=1',
                RepositoryOwner: 'public, max-age=10',
              },
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.nestedTypeQuery);

            responseData = cacheManager.cacheQuery(
              requestData,
              requestData,
              responses.nestedTypeQuery,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery })
            );
          });

          it('correct response data', () => {
            expect(responseData).toMatchSnapshot();
          });

          it('correct cache data', async () => {
            await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
          });
        });
      });

      describe('nested union with edges >>', () => {
        describe('cascading cache control >>', () => {
          beforeAll(() => {
            responseData = undefined;

            cacheManager = new CacheManager({
              cache: new Core({
                name: 'cachemap',
                store: map(),
                type: 'someType',
              }),
              cascadeCacheControl: true,
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.nestedUnionQuery);

            responseData = cacheManager.cacheQuery(
              requestData,
              requestData,
              responses.nestedUnionQuery,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery })
            );
          });

          it('correct response data', () => {
            expect(responseData).toMatchSnapshot();
          });

          it('correct cache data', async () => {
            await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
          });
        });

        describe('type cache directives >>', () => {
          beforeAll(() => {
            responseData = undefined;

            cacheManager = new CacheManager({
              cache: new Core({
                name: 'cachemap',
                store: map(),
                type: 'someType',
              }),
              typeCacheDirectives: {
                SearchResultItem: 'public, max-age=1',
                SearchResultItemConnection: 'public, max-age=3',
              },
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.nestedUnionQuery);

            responseData = cacheManager.cacheQuery(
              requestData,
              requestData,
              responses.nestedUnionQuery,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery })
            );
          });

          it('correct response data', () => {
            expect(responseData).toMatchSnapshot();
          });

          it('correct cache data', async () => {
            await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
          });
        });
      });
    });

    describe('filtered >>', () => {
      describe('single type >>', () => {
        describe('cascading cache control >>', () => {
          beforeAll(() => {
            responseData = undefined;
            // @ts-expect-error property is private
            jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

            cacheManager = new CacheManager({
              cache: new Core({
                name: 'cachemap',
                store: map(),
                type: 'someType',
              }),
              cascadeCacheControl: true,
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.singleTypeQuerySet.initial);

            cacheManager.cacheQuery(
              requestData,
              requestData,
              responses.singleTypeQuerySet.initial,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery })
            );

            const { cacheMetadata, data } = responses.singleTypeQuerySet.partial;

            // @ts-expect-error property is private
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            jest.spyOn(cacheManager._partialQueryResponses, 'get').mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata),
              data,
            });

            responseData = cacheManager.cacheQuery(
              getRequestData(parsedRequests.singleTypeQuerySet.full),
              getRequestData(parsedRequests.singleTypeQuerySet.updated),
              responses.singleTypeQuerySet.updated as RawResponseDataWithMaybeCacheMetadata,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery, queryFiltered: true })
            );
          });

          it('correct response data', () => {
            expect(responseData).toMatchSnapshot();
          });

          it('correct cache data', async () => {
            await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
          });
        });

        describe('type cache directives >>', () => {
          beforeAll(() => {
            responseData = undefined;
            // @ts-expect-error property is private
            jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

            cacheManager = new CacheManager({
              cache: new Core({
                name: 'cachemap',
                store: map(),
                type: 'someType',
              }),
              typeCacheDirectives: {
                Organization: 'public, max-age=1',
              },
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.singleTypeQuerySet.initial);

            cacheManager.cacheQuery(
              requestData,
              requestData,
              responses.singleTypeQuerySet.initial,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery })
            );

            const { cacheMetadata, data } = responses.singleTypeQuerySet.partial;

            // @ts-expect-error property is private
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            jest.spyOn(cacheManager._partialQueryResponses, 'get').mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata),
              data,
            });

            responseData = cacheManager.cacheQuery(
              getRequestData(parsedRequests.singleTypeQuerySet.full),
              getRequestData(parsedRequests.singleTypeQuerySet.updated),
              responses.singleTypeQuerySet.updated as RawResponseDataWithMaybeCacheMetadata,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery, queryFiltered: true })
            );
          });

          it('correct response data', () => {
            expect(responseData).toMatchSnapshot();
          });

          it('correct cache data', async () => {
            await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
          });
        });
      });

      describe('nested type with edges >>', () => {
        describe('cascading cache control >>', () => {
          beforeAll(async () => {
            responseData = undefined;
            // @ts-expect-error property is private
            jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

            cacheManager = new CacheManager({
              cache: new Core({
                name: 'cachemap',
                store: map(),
                type: 'someType',
              }),
              cascadeCacheControl: true,
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.nestedTypeQuerySet.initial);

            cacheManager.cacheQuery(
              requestData,
              requestData,
              responses.nestedTypeQuerySet.initial,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery })
            );

            await new Promise((...args) => process.nextTick(...args));

            const { cacheMetadata, data } = responses.nestedTypeQuerySet.partial;

            // @ts-expect-error property is private
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            jest.spyOn(cacheManager._partialQueryResponses, 'get').mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata),
              data,
            });

            responseData = cacheManager.cacheQuery(
              getRequestData(parsedRequests.nestedTypeQuerySet.full),
              getRequestData(parsedRequests.nestedTypeQuerySet.updated),
              responses.nestedTypeQuerySet.updated as RawResponseDataWithMaybeCacheMetadata,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery, queryFiltered: true })
            );
          });

          it('correct response data', () => {
            expect(responseData).toMatchSnapshot();
          });

          it('correct cache data', async () => {
            await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
          });
        });

        describe('type cache directives >>', () => {
          beforeAll(async () => {
            responseData = undefined;
            // @ts-expect-error property is private
            jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

            cacheManager = new CacheManager({
              cache: new Core({
                name: 'cachemap',
                store: map(),
                type: 'someType',
              }),
              typeCacheDirectives: {
                Organization: 'public, max-age=3',
                Repository: 'public, max-age=2',
                RepositoryConnection: 'public, max-age=1',
                RepositoryOwner: 'public, max-age=10',
              },
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.nestedTypeQuerySet.initial);

            cacheManager.cacheQuery(
              requestData,
              requestData,
              responses.nestedTypeQuerySet.initial,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery })
            );

            await new Promise((...args) => process.nextTick(...args));

            const { cacheMetadata, data } = responses.nestedTypeQuerySet.partial;

            // @ts-expect-error property is private
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            jest.spyOn(cacheManager._partialQueryResponses, 'get').mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata),
              data,
            });

            responseData = cacheManager.cacheQuery(
              getRequestData(parsedRequests.nestedTypeQuerySet.full),
              getRequestData(parsedRequests.nestedTypeQuerySet.updated),
              responses.nestedTypeQuerySet.updated as RawResponseDataWithMaybeCacheMetadata,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery, queryFiltered: true })
            );
          });

          it('correct response data', () => {
            expect(responseData).toMatchSnapshot();
          });

          it('correct cache data', async () => {
            await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
          });
        });
      });

      describe('nested union with edges >>', () => {
        describe('cascading cache control >>', () => {
          beforeAll(async () => {
            responseData = undefined;
            // @ts-expect-error property is private
            jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

            cacheManager = new CacheManager({
              cache: new Core({
                name: 'cachemap',
                store: map(),
                type: 'someType',
              }),
              cascadeCacheControl: true,
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.nestedUnionQuerySet.initial);

            cacheManager.cacheQuery(
              requestData,
              requestData,
              responses.nestedUnionQuerySet.initial,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery })
            );

            await new Promise((...args) => process.nextTick(...args));

            const { cacheMetadata, data } = responses.nestedUnionQuerySet.partial;

            // @ts-expect-error property is private
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            jest.spyOn(cacheManager._partialQueryResponses, 'get').mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata),
              data,
            });

            responseData = cacheManager.cacheQuery(
              getRequestData(parsedRequests.nestedUnionQuerySet.full),
              getRequestData(parsedRequests.nestedUnionQuerySet.updated),
              responses.nestedUnionQuerySet.updated as RawResponseDataWithMaybeCacheMetadata,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery, queryFiltered: true })
            );
          });

          it('correct response data', () => {
            expect(responseData).toMatchSnapshot();
          });

          it('correct cache data', async () => {
            await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
          });
        });

        describe('type cache directives >>', () => {
          beforeAll(async () => {
            responseData = undefined;
            // @ts-expect-error property is private
            jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

            cacheManager = new CacheManager({
              cache: new Core({
                name: 'cachemap',
                store: map(),
                type: 'someType',
              }),
              typeCacheDirectives: {
                SearchResultItem: 'public, max-age=1',
                SearchResultItemConnection: 'public, max-age=3',
              },
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.nestedUnionQuerySet.initial);

            cacheManager.cacheQuery(
              requestData,
              requestData,
              responses.nestedUnionQuerySet.initial,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery })
            );

            await new Promise((...args) => process.nextTick(...args));

            const { cacheMetadata, data } = responses.nestedUnionQuerySet.partial;

            // @ts-expect-error property is private
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            jest.spyOn(cacheManager._partialQueryResponses, 'get').mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata),
              data,
            });

            responseData = cacheManager.cacheQuery(
              getRequestData(parsedRequests.nestedUnionQuerySet.full),
              getRequestData(parsedRequests.nestedUnionQuerySet.updated),
              responses.nestedUnionQuerySet.updated as RawResponseDataWithMaybeCacheMetadata,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery, queryFiltered: true })
            );
          });

          it('correct response data', () => {
            expect(responseData).toMatchSnapshot();
          });

          it('correct cache data', async () => {
            await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
          });
        });
      });

      describe('defer >>', () => {
        describe('cascading cache control >>', () => {
          const responseDataSet: ResponseData[] = [];

          beforeAll(async () => {
            // @ts-expect-error property is private
            jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

            cacheManager = new CacheManager({
              cache: new Core({
                name: 'cachemap',
                store: map(),
                type: 'someType',
              }),
              cascadeCacheControl: true,
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.deferQuerySet.initial);

            cacheManager.cacheQuery(
              requestData,
              requestData,
              responses.deferQuerySet.initial,
              {},
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.deferQuery, hasDeferOrStream: true })
            );

            await new Promise((...args) => process.nextTick(...args));

            const { cacheMetadata, data } = responses.deferQuerySet.partial;

            // @ts-expect-error property is private
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            jest.spyOn(cacheManager._partialQueryResponses, 'get').mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata),
              data,
            });

            await new Promise<void>(resolve => {
              const updateResponses = [...(responses.deferQuerySet.updated as RawResponseDataWithMaybeCacheMetadata[])];

              const interval = setInterval(() => {
                const result = cacheManager.cacheQuery(
                  getRequestData(parsedRequests.deferQuerySet.full),
                  getRequestData(parsedRequests.deferQuerySet.updated),
                  updateResponses.shift()!,
                  {},
                  getRequestContext({
                    fieldTypeMap: requestFieldTypeMaps.deferQuery,
                    hasDeferOrStream: true,
                    queryFiltered: true,
                  })
                );

                responseDataSet.push(result);

                if (updateResponses.length === 0) {
                  clearInterval(interval);
                  resolve();
                }
              }, 50);
            });
          });

          it('correct response data', () => {
            expect(responseDataSet).toMatchSnapshot();
          });

          it('correct cache data', async () => {
            await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
          });
        });
      });
    });
  });

  describe('analyzeQuery >>', () => {
    let analyzeQueryResult: AnalyzeQueryResult | undefined;

    describe('no matching data >>', () => {
      describe('single type >>', () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.singleTypeQuery),
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery })
          );
        });

        it('correct request data', () => {
          const { ast, ...otherProps } = analyzeQueryResult!.updated!;
          expect(otherProps).toMatchSnapshot();
        });

        it('no response data', () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });
      });

      describe('nested type with edges >>', () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.nestedTypeQuery),
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery })
          );
        });

        it('correct request data', () => {
          const { ast, ...otherProps } = analyzeQueryResult!.updated!;
          expect(otherProps).toMatchSnapshot();
        });

        it('no response data', () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });
      });

      describe('nested union with edges >>', () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.nestedUnionQuery),
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery })
          );
        });

        it('correct request data', () => {
          const { ast, ...otherProps } = analyzeQueryResult!.updated!;
          expect(otherProps).toMatchSnapshot();
        });

        it('no response data', () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });
      });

      describe('defer >>', () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.deferQuery),
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.deferQuery, hasDeferOrStream: true })
          );
        });

        it('correct request data', () => {
          const { ast, ...otherProps } = analyzeQueryResult!.updated!;
          expect(otherProps).toMatchSnapshot();
        });

        it('no response data', () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });
      });
    });

    describe('entire matching data >>', () => {
      describe('single type >>', () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-expect-error property is private
          jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            typeCacheDirectives: {
              Organization: 'public, max-age=1',
            },
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          const requestData = getRequestData(parsedRequests.singleTypeQuery);

          cacheManager.cacheQuery(
            requestData,
            requestData,
            responses.singleTypeQuery,
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery })
          );

          await new Promise((...args) => process.nextTick(...args));

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.singleTypeQuery),
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery })
          );
        });

        it('no request data', () => {
          expect(analyzeQueryResult?.updated).toBeUndefined();
        });

        it('correct response data', () => {
          expect(analyzeQueryResult?.response).toMatchSnapshot();
        });

        it('correct cache data', async () => {
          await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
        });
      });

      describe('nested type with edges >>', () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-expect-error property is private
          jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            typeCacheDirectives: {
              Organization: 'public, max-age=3',
              Repository: 'public, max-age=2',
              RepositoryConnection: 'public, max-age=1',
              RepositoryOwner: 'public, max-age=10',
            },
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          const requestData = getRequestData(parsedRequests.nestedTypeQuery);

          cacheManager.cacheQuery(
            requestData,
            requestData,
            responses.nestedTypeQuery,
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery })
          );

          await new Promise((...args) => process.nextTick(...args));

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.nestedTypeQuery),
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery })
          );
        });

        it('no request data', () => {
          expect(analyzeQueryResult?.updated).toBeUndefined();
        });

        it('correct response data', () => {
          expect(analyzeQueryResult?.response).toMatchSnapshot();
        });

        it('correct cache data', async () => {
          await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
        });
      });

      describe('nested union with edges >>', () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-expect-error property is private
          jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            typeCacheDirectives: {
              SearchResultItem: 'public, max-age=1',
              SearchResultItemConnection: 'public, max-age=3',
            },
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          const requestData = getRequestData(parsedRequests.nestedUnionQuery);

          cacheManager.cacheQuery(
            requestData,
            requestData,
            responses.nestedUnionQuery,
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery })
          );

          await new Promise((...args) => process.nextTick(...args));

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.nestedUnionQuery),
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery })
          );
        });

        it('no request data', () => {
          expect(analyzeQueryResult?.updated).toBeUndefined();
        });

        it('correct response data', () => {
          expect(analyzeQueryResult?.response).toMatchSnapshot();
        });

        it('correct cache data', async () => {
          await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
        });
      });

      describe('defer >>', () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-expect-error property is private
          jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            cascadeCacheControl: true,
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          const requestData = getRequestData(parsedRequests.deferQuerySet.updated);

          await new Promise<void>(resolve => {
            const updateResponses = [...(responses.deferQuerySet.updated as RawResponseDataWithMaybeCacheMetadata[])];

            const interval = setInterval(() => {
              cacheManager.cacheQuery(
                requestData,
                requestData,
                updateResponses.shift()!,
                {},
                getRequestContext({
                  fieldTypeMap: requestFieldTypeMaps.deferQuery,
                  hasDeferOrStream: true,
                })
              );

              if (updateResponses.length === 0) {
                clearInterval(interval);
                resolve();
              }
            }, 50);
          });

          await new Promise((...args) => process.nextTick(...args));

          analyzeQueryResult = await cacheManager.analyzeQuery(
            requestData,
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.deferQuery, hasDeferOrStream: true })
          );
        });

        it('no request data', () => {
          expect(analyzeQueryResult?.updated).toBeUndefined();
        });

        it('correct response data', () => {
          expect(analyzeQueryResult?.response).toMatchSnapshot();
        });

        it('correct cache data', async () => {
          await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
        });
      });
    });

    describe('some matching data >>', () => {
      describe('single type >>', () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-expect-error property is private
          jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            typeCacheDirectives: {
              Organization: 'public, max-age=1',
            },
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          const requestData = getRequestData(parsedRequests.singleTypeQuerySet.initial);

          cacheManager.cacheQuery(
            requestData,
            requestData,
            responses.singleTypeQuerySet.initial,
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery })
          );

          await new Promise((...args) => process.nextTick(...args));

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.singleTypeQuery),
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery })
          );
        });

        it('correct request data', () => {
          const { ast, ...otherProps } = analyzeQueryResult!.updated!;
          expect(otherProps).toMatchSnapshot();
        });

        it('no response data', () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });

        it('correct cache data', async () => {
          await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
        });

        it('correct partial data', () => {
          // @ts-expect-error property is private
          expect(cacheManager._partialQueryResponses).toMatchSnapshot();
        });
      });

      describe('single type with just ID match >>', () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-expect-error property is private
          jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            typeCacheDirectives: {
              Organization: 'public, max-age=1',
            },
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          const requestData = getRequestData(parsedRequests.singleTypeQuerySmallA);

          cacheManager.cacheQuery(
            requestData,
            requestData,
            responses.singleTypeQuerySmallA,
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery })
          );

          await new Promise((...args) => process.nextTick(...args));

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.singleTypeQuerySmallB),
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery })
          );
        });

        it('correct request data', () => {
          const { ast, ...otherProps } = analyzeQueryResult!.updated!;
          expect(otherProps).toMatchSnapshot();
        });

        it('no response data', () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });

        it('correct cache data', async () => {
          await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
        });

        it('correct partial data', () => {
          // @ts-expect-error property is private
          expect(cacheManager._partialQueryResponses).toMatchSnapshot();
        });
      });

      describe('nested type with edges >', () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-expect-error property is private
          jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            typeCacheDirectives: {
              Organization: 'public, max-age=3',
              Repository: 'public, max-age=2',
              RepositoryConnection: 'public, max-age=1',
              RepositoryOwner: 'public, max-age=10',
            },
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          const requestData = getRequestData(parsedRequests.nestedTypeQuerySet.initial);

          cacheManager.cacheQuery(
            requestData,
            requestData,
            responses.nestedTypeQuerySet.initial,
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery })
          );

          await new Promise((...args) => process.nextTick(...args));

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.nestedTypeQuery),
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery })
          );
        });

        it('correct request data', () => {
          const { ast, ...otherProps } = analyzeQueryResult!.updated!;
          expect(otherProps).toMatchSnapshot();
        });

        it('no response data', () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });

        it('correct cache data', async () => {
          await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
        });

        it('correct partial data', () => {
          // @ts-expect-error property is private
          expect(cacheManager._partialQueryResponses).toMatchSnapshot();
        });
      });

      describe('nested union with edges >>', () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-expect-error property is private
          jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            typeCacheDirectives: {
              SearchResultItem: 'public, max-age=1',
              SearchResultItemConnection: 'public, max-age=3',
            },
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          const requestData = getRequestData(parsedRequests.nestedUnionQuerySet.initial);

          cacheManager.cacheQuery(
            requestData,
            requestData,
            responses.nestedUnionQuerySet.initial,
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery })
          );

          await new Promise((...args) => process.nextTick(...args));

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.nestedUnionQuery),
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery })
          );
        });

        it('correct request data', () => {
          const { ast, ...otherProps } = analyzeQueryResult!.updated!;
          expect(otherProps).toMatchSnapshot();
        });

        it('no response data', () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });

        it('correct cache data', async () => {
          await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
        });

        it('correct partial data', () => {
          // @ts-expect-error property is private
          expect(cacheManager._partialQueryResponses).toMatchSnapshot();
        });
      });

      describe('fragment spreads >> within fragment spreads >>', () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-expect-error property is private
          jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            cascadeCacheControl: true,
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          const requestData = getRequestData(parsedRequests.getSearchResultsQuery);

          cacheManager.cacheQuery(
            requestData,
            requestData,
            responses.getSearchResultsQuery,
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.getSearchResultsQuery, hasDeferOrStream: true })
          );

          await new Promise((...args) => process.nextTick(...args));

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.getMoviePreviewQuery),
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.getMoviePreviewQuery, hasDeferOrStream: true })
          );
        });

        it('correct request data', () => {
          const { ast, ...otherProps } = analyzeQueryResult!.updated!;
          expect(otherProps).toMatchSnapshot();
        });

        it('no response data', () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });

        it('correct cache data', async () => {
          await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
        });

        it('correct partial data', () => {
          // @ts-expect-error property is private
          expect(cacheManager._partialQueryResponses).toMatchSnapshot();
        });
      });

      describe('defer >>', () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-expect-error property is private
          jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Core({
              name: 'cachemap',
              store: map(),
              type: 'someType',
            }),
            cascadeCacheControl: true,
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          const requestData = getRequestData(parsedRequests.deferQuerySet.initial);

          cacheManager.cacheQuery(
            requestData,
            requestData,
            responses.deferQuerySet.initial,
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.deferQuery, hasDeferOrStream: true })
          );

          await new Promise((...args) => process.nextTick(...args));

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.deferQuery),
            {},
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.deferQuery, hasDeferOrStream: true })
          );
        });

        it('correct request data', () => {
          const { ast, ...otherProps } = analyzeQueryResult!.updated!;
          expect(otherProps).toMatchSnapshot();
        });

        it('no response data', () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });

        it('correct cache data', async () => {
          await expect(cacheManager.cache.export()).resolves.toMatchSnapshot();
        });

        it('correct partial data', () => {
          // @ts-expect-error property is private
          expect(cacheManager._partialQueryResponses).toMatchSnapshot();
        });
      });
    });
  });
});
