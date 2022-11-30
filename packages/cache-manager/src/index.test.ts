import Cachemap from "@cachemap/core";
import map from "@cachemap/map";
import {
  IncrementalRequestManagerResult,
  MUTATION,
  RequestData,
  RequestManagerResult,
  SUBSCRIPTION,
  SubscriptionsManagerResult,
} from "@graphql-box/core";
import {
  getRequestContext,
  getRequestData,
  parsedRequests,
  requestFieldTypeMaps,
  responses,
  transformResultCacheMetadata,
} from "@graphql-box/test-utils";
import CacheManager, { AnalyzeQueryResult, CacheManagerDef } from ".";

describe("@graphql-box/cache-manager >>", () => {
  const realDateNow = Date.now.bind(global.Date);
  let cacheManager: CacheManagerDef;

  beforeAll(() => {
    global.Date.now = jest.fn().mockReturnValue(Date.parse("June 6, 1979 GMT"));
  });

  afterAll(() => {
    global.Date.now = realDateNow;
  });

  describe("resolveRequest >>", () => {
    let responseData: RequestManagerResult | IncrementalRequestManagerResult | SubscriptionsManagerResult | undefined;
    let requestData: RequestData;

    describe("mutation >> nested interface >>", () => {
      describe("cascading cache control >>", () => {
        beforeAll(async () => {
          responseData = undefined;

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
            cascadeCacheControl: true,
          });

          requestData = getRequestData(parsedRequests.nestedInterfaceMutation);

          responseData = await cacheManager.cacheResponse(
            requestData,
            transformResultCacheMetadata(responses.nestedInterfaceMutation),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedInterfaceMutation, operation: MUTATION }),
          );
        });

        it("correct response data", () => {
          expect(responseData).toMatchSnapshot();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });
      });

      describe("type cache directives >>", () => {
        beforeAll(async () => {
          responseData = undefined;

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
            typeCacheDirectives: {
              AddStarPayload: "no-cache, no-store",
              StargazerConnection: "public, max-age=1",
              StargazerEdge: "public, max-age=1",
              Starrable: "public, max-age=10",
              User: "public, max-age=5",
            },
          });

          requestData = getRequestData(parsedRequests.nestedInterfaceMutation);

          responseData = await cacheManager.cacheResponse(
            requestData,
            transformResultCacheMetadata(responses.nestedInterfaceMutation),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedInterfaceMutation, operation: MUTATION }),
          );
        });

        it("correct response data", () => {
          expect(responseData).toMatchSnapshot();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });
      });
    });

    describe("subscription >> nested type >>", () => {
      describe("cascading cache control >>", () => {
        beforeAll(async () => {
          responseData = undefined;

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
            cascadeCacheControl: true,
          });

          requestData = getRequestData(parsedRequests.nestedTypeSubscription);

          responseData = await cacheManager.cacheResponse(
            requestData,
            transformResultCacheMetadata(responses.nestedTypeSubscription),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeSubscription, operation: SUBSCRIPTION }),
          );
        });

        it("correct response data", () => {
          expect(responseData).toMatchSnapshot();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });
      });

      describe("type cache directives >>", () => {
        beforeAll(async () => {
          responseData = undefined;

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
            typeCacheDirectives: {
              Email: "public, max-age=5",
              Inbox: "public, max-age=1",
            },
          });

          requestData = getRequestData(parsedRequests.nestedTypeSubscription);

          responseData = await cacheManager.cacheResponse(
            requestData,
            transformResultCacheMetadata(responses.nestedTypeSubscription),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeSubscription, operation: SUBSCRIPTION }),
          );
        });

        it("correct response data", () => {
          expect(responseData).toMatchSnapshot();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });
      });
    });
  });

  describe("resolveQuery >>", () => {
    let responseData: RequestManagerResult | IncrementalRequestManagerResult | SubscriptionsManagerResult | undefined;
    let requestData: RequestData;

    describe("not filtered >>", () => {
      describe("single type >>", () => {
        describe("cascading cache control >>", () => {
          beforeAll(async () => {
            responseData = undefined;

            cacheManager = new CacheManager({
              cache: new Cachemap({
                name: "cachemap",
                store: map(),
                type: "someType",
              }),
              cascadeCacheControl: true,
            });

            requestData = getRequestData(parsedRequests.singleTypeQuery);

            responseData = await cacheManager.cacheQuery(
              requestData,
              requestData,
              transformResultCacheMetadata(responses.singleTypeQuery),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
            );
          });

          it("correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("correct cache data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });

        describe("type cache directives >>", () => {
          beforeAll(async () => {
            responseData = undefined;

            cacheManager = new CacheManager({
              cache: new Cachemap({
                name: "cachemap",
                store: map(),
                type: "someType",
              }),
              typeCacheDirectives: {
                Organization: "public, max-age=1",
              },
            });

            requestData = getRequestData(parsedRequests.singleTypeQuery);

            responseData = await cacheManager.cacheQuery(
              requestData,
              requestData,
              transformResultCacheMetadata(responses.singleTypeQuery),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
            );
          });

          it("correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("correct cache data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });
      });

      describe("nested type with edges >>", () => {
        describe("cascading cache control >>", () => {
          beforeAll(async () => {
            responseData = undefined;

            cacheManager = new CacheManager({
              cache: new Cachemap({
                name: "cachemap",
                store: map(),
                type: "someType",
              }),
              cascadeCacheControl: true,
            });

            requestData = getRequestData(parsedRequests.nestedTypeQuery);

            responseData = await cacheManager.cacheQuery(
              requestData,
              requestData,
              transformResultCacheMetadata(responses.nestedTypeQuery),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
            );
          });

          it("correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("correct cache data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });

        describe("type cache directives >>", () => {
          beforeAll(async () => {
            responseData = undefined;

            cacheManager = new CacheManager({
              cache: new Cachemap({
                name: "cachemap",
                store: map(),
                type: "someType",
              }),
              typeCacheDirectives: {
                Organization: "public, max-age=3",
                Repository: "public, max-age=2",
                RepositoryConnection: "public, max-age=1",
                RepositoryOwner: "public, max-age=10",
              },
            });

            requestData = getRequestData(parsedRequests.nestedTypeQuery);

            responseData = await cacheManager.cacheQuery(
              requestData,
              requestData,
              transformResultCacheMetadata(responses.nestedTypeQuery),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
            );
          });

          it("correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("correct cache data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });
      });

      describe("nested union with edges >>", () => {
        describe("cascading cache control >>", () => {
          beforeAll(async () => {
            responseData = undefined;

            cacheManager = new CacheManager({
              cache: new Cachemap({
                name: "cachemap",
                store: map(),
                type: "someType",
              }),
              cascadeCacheControl: true,
            });

            requestData = getRequestData(parsedRequests.nestedUnionQuery);

            responseData = await cacheManager.cacheQuery(
              requestData,
              requestData,
              transformResultCacheMetadata(responses.nestedUnionQuery),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery }),
            );
          });

          it("correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("correct cache data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });

        describe("type cache directives >>", () => {
          beforeAll(async () => {
            responseData = undefined;

            cacheManager = new CacheManager({
              cache: new Cachemap({
                name: "cachemap",
                store: map(),
                type: "someType",
              }),
              typeCacheDirectives: {
                SearchResultItem: "public, max-age=1",
                SearchResultItemConnection: "public, max-age=3",
              },
            });

            requestData = getRequestData(parsedRequests.nestedUnionQuery);

            responseData = await cacheManager.cacheQuery(
              requestData,
              requestData,
              transformResultCacheMetadata(responses.nestedUnionQuery),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery }),
            );
          });

          it("correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("correct cache data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });
      });
    });

    describe("filtered >>", () => {
      describe("single type >>", () => {
        describe("cascading cache control >>", () => {
          beforeAll(async () => {
            responseData = undefined;
            // @ts-ignore
            jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

            cacheManager = new CacheManager({
              cache: new Cachemap({
                name: "cachemap",
                store: map(),
                type: "someType",
              }),
              cascadeCacheControl: true,
            });

            requestData = getRequestData(parsedRequests.singleTypeQuerySet.initial);

            await cacheManager.cacheQuery(
              requestData,
              requestData,
              transformResultCacheMetadata(responses.singleTypeQuerySet.initial),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
            );

            jest
              // @ts-ignore
              .spyOn(cacheManager._partialQueryResponses, "get")
              .mockReturnValue(transformResultCacheMetadata(responses.singleTypeQuerySet.partial));

            responseData = await cacheManager.cacheQuery(
              getRequestData(parsedRequests.singleTypeQuerySet.full),
              getRequestData(parsedRequests.singleTypeQuerySet.updated),
              transformResultCacheMetadata(responses.singleTypeQuerySet.updated),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery, queryFiltered: true }),
            );
          });

          it("correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("correct cache data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });

        describe("type cache directives >>", () => {
          beforeAll(async () => {
            responseData = undefined;
            // @ts-ignore
            jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

            cacheManager = new CacheManager({
              cache: new Cachemap({
                name: "cachemap",
                store: map(),
                type: "someType",
              }),
              typeCacheDirectives: {
                Organization: "public, max-age=1",
              },
            });

            requestData = getRequestData(parsedRequests.singleTypeQuerySet.initial);

            await cacheManager.cacheQuery(
              requestData,
              requestData,
              transformResultCacheMetadata(responses.singleTypeQuerySet.initial),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
            );

            jest
              // @ts-ignore
              .spyOn(cacheManager._partialQueryResponses, "get")
              .mockReturnValue(transformResultCacheMetadata(responses.singleTypeQuerySet.partial));

            responseData = await cacheManager.cacheQuery(
              getRequestData(parsedRequests.singleTypeQuerySet.full),
              getRequestData(parsedRequests.singleTypeQuerySet.updated),
              transformResultCacheMetadata(responses.singleTypeQuerySet.updated),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery, queryFiltered: true }),
            );
          });

          it("correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("correct cache data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });
      });

      describe("nested type with edges >>", () => {
        describe("cascading cache control >>", () => {
          beforeAll(async () => {
            responseData = undefined;
            // @ts-ignore
            jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

            cacheManager = new CacheManager({
              cache: new Cachemap({
                name: "cachemap",
                store: map(),
                type: "someType",
              }),
              cascadeCacheControl: true,
            });

            requestData = getRequestData(parsedRequests.nestedTypeQuerySet.initial);

            await cacheManager.cacheQuery(
              requestData,
              requestData,
              transformResultCacheMetadata(responses.nestedTypeQuerySet.initial),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
            );

            jest
              // @ts-ignore
              .spyOn(cacheManager._partialQueryResponses, "get")
              .mockReturnValue(transformResultCacheMetadata(responses.nestedTypeQuerySet.partial));

            responseData = await cacheManager.cacheQuery(
              getRequestData(parsedRequests.nestedTypeQuerySet.full),
              getRequestData(parsedRequests.nestedTypeQuerySet.updated),
              transformResultCacheMetadata(responses.nestedTypeQuerySet.updated),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery, queryFiltered: true }),
            );
          });

          it("correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("correct cache data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });

        describe("type cache directives >>", () => {
          beforeAll(async () => {
            responseData = undefined;
            // @ts-ignore
            jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

            cacheManager = new CacheManager({
              cache: new Cachemap({
                name: "cachemap",
                store: map(),
                type: "someType",
              }),
              typeCacheDirectives: {
                Organization: "public, max-age=3",
                Repository: "public, max-age=2",
                RepositoryConnection: "public, max-age=1",
                RepositoryOwner: "public, max-age=10",
              },
            });

            requestData = getRequestData(parsedRequests.nestedTypeQuerySet.initial);

            await cacheManager.cacheQuery(
              requestData,
              requestData,
              transformResultCacheMetadata(responses.nestedTypeQuerySet.initial),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
            );

            jest
              // @ts-ignore
              .spyOn(cacheManager._partialQueryResponses, "get")
              .mockReturnValue(transformResultCacheMetadata(responses.nestedTypeQuerySet.partial));

            responseData = await cacheManager.cacheQuery(
              getRequestData(parsedRequests.nestedTypeQuerySet.full),
              getRequestData(parsedRequests.nestedTypeQuerySet.updated),
              transformResultCacheMetadata(responses.nestedTypeQuerySet.updated),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery, queryFiltered: true }),
            );
          });

          it("correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("correct cache data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });
      });

      describe("nested union with edges >>", () => {
        describe("cascading cache control >>", () => {
          beforeAll(async () => {
            responseData = undefined;
            // @ts-ignore
            jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

            cacheManager = new CacheManager({
              cache: new Cachemap({
                name: "cachemap",
                store: map(),
                type: "someType",
              }),
              cascadeCacheControl: true,
            });

            requestData = getRequestData(parsedRequests.nestedUnionQuerySet.initial);

            await cacheManager.cacheQuery(
              requestData,
              requestData,
              transformResultCacheMetadata(responses.nestedUnionQuerySet.initial),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery }),
            );

            jest
              // @ts-ignore
              .spyOn(cacheManager._partialQueryResponses, "get")
              .mockReturnValue(transformResultCacheMetadata(responses.nestedUnionQuerySet.partial));

            responseData = await cacheManager.cacheQuery(
              getRequestData(parsedRequests.nestedUnionQuerySet.full),
              getRequestData(parsedRequests.nestedUnionQuerySet.updated),
              transformResultCacheMetadata(responses.nestedUnionQuerySet.updated),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery, queryFiltered: true }),
            );
          });

          it("correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("correct cache data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });

        describe("type cache directives >>", () => {
          beforeAll(async () => {
            responseData = undefined;
            // @ts-ignore
            jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

            cacheManager = new CacheManager({
              cache: new Cachemap({
                name: "cachemap",
                store: map(),
                type: "someType",
              }),
              typeCacheDirectives: {
                SearchResultItem: "public, max-age=1",
                SearchResultItemConnection: "public, max-age=3",
              },
            });

            requestData = getRequestData(parsedRequests.nestedUnionQuerySet.initial);

            await cacheManager.cacheQuery(
              requestData,
              requestData,
              transformResultCacheMetadata(responses.nestedUnionQuerySet.initial),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery }),
            );

            jest
              // @ts-ignore
              .spyOn(cacheManager._partialQueryResponses, "get")
              .mockReturnValue(transformResultCacheMetadata(responses.nestedUnionQuerySet.partial));

            responseData = await cacheManager.cacheQuery(
              getRequestData(parsedRequests.nestedUnionQuerySet.full),
              getRequestData(parsedRequests.nestedUnionQuerySet.updated),
              transformResultCacheMetadata(responses.nestedUnionQuerySet.updated),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery, queryFiltered: true }),
            );
          });

          it("correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("correct cache data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });
      });

      describe("defer >>", () => {
        describe("cascading cache control >>", () => {
          const responseDataSet: IncrementalRequestManagerResult[] = [];

          beforeAll(async () => {
            // @ts-ignore
            jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

            cacheManager = new CacheManager({
              cache: new Cachemap({
                name: "cachemap",
                store: map(),
                type: "someType",
              }),
              cascadeCacheControl: true,
            });

            requestData = getRequestData(parsedRequests.deferQuerySet.initial);

            await cacheManager.cacheQuery(
              requestData,
              requestData,
              transformResultCacheMetadata(responses.deferQuerySet.initial),
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.deferQuery, hasDeferOrStream: true }),
            );

            jest
              // @ts-ignore
              .spyOn(cacheManager._partialQueryResponses, "get")
              .mockReturnValue(transformResultCacheMetadata(responses.deferQuerySet.partial));

            await new Promise((resolve: (value: void) => void) => {
              const updateResponses = [
                ...responses.deferQuerySet.updated.map(entry => transformResultCacheMetadata(entry)),
              ];

              const interval = setInterval(async () => {
                const result = (await cacheManager.cacheQuery(
                  getRequestData(parsedRequests.deferQuerySet.full),
                  getRequestData(parsedRequests.deferQuerySet.updated),
                  updateResponses.shift() as IncrementalRequestManagerResult,
                  { awaitDataCaching: true },
                  getRequestContext({
                    fieldTypeMap: requestFieldTypeMaps.deferQuery,
                    hasDeferOrStream: true,
                    queryFiltered: true,
                  }),
                )) as IncrementalRequestManagerResult;

                responseDataSet.push(result);

                if (!updateResponses.length) {
                  clearInterval(interval);
                  resolve();
                }
              }, 50);
            });
          });

          it("correct response data", () => {
            expect(responseDataSet).toMatchSnapshot();
          });

          it("correct cache data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });
      });
    });
  });

  describe("analyzeQuery >>", () => {
    let analyzeQueryResult: AnalyzeQueryResult | undefined;

    describe("no matching data >>", () => {
      describe("single type >>", () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
          });

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.singleTypeQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
          );
        });

        it("correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult?.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("no response data", () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });
      });

      describe("nested type with edges >>", () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
          });

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.nestedTypeQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
          );
        });

        it("correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult?.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("no response data", () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });
      });

      describe("nested union with edges >>", () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
          });

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.nestedUnionQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery }),
          );
        });

        it("correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult?.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("no response data", () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });
      });

      describe("defer >>", () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
          });

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.deferQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.deferQuery, hasDeferOrStream: true }),
          );
        });

        it("correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult?.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("no response data", () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });
      });
    });

    describe("entire matching data >>", () => {
      describe("single type >>", () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-ignore
          jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
            typeCacheDirectives: {
              Organization: "public, max-age=1",
            },
          });

          const requestData = getRequestData(parsedRequests.singleTypeQuery);

          await cacheManager.cacheQuery(
            requestData,
            requestData,
            transformResultCacheMetadata(responses.singleTypeQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
          );

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.singleTypeQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
          );
        });

        it("no request data", () => {
          expect(analyzeQueryResult?.updated).toBeUndefined();
        });

        it("correct response data", () => {
          expect(analyzeQueryResult?.response).toMatchSnapshot();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });
      });

      describe("nested type with edges >>", () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-ignore
          jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
            typeCacheDirectives: {
              Organization: "public, max-age=3",
              Repository: "public, max-age=2",
              RepositoryConnection: "public, max-age=1",
              RepositoryOwner: "public, max-age=10",
            },
          });

          const requestData = getRequestData(parsedRequests.nestedTypeQuery);

          await cacheManager.cacheQuery(
            requestData,
            requestData,
            transformResultCacheMetadata(responses.nestedTypeQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
          );

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.nestedTypeQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
          );
        });

        it("no request data", () => {
          expect(analyzeQueryResult?.updated).toBeUndefined();
        });

        it("correct response data", () => {
          expect(analyzeQueryResult?.response).toMatchSnapshot();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });
      });

      describe("nested union with edges >>", () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-ignore
          jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
            typeCacheDirectives: {
              SearchResultItem: "public, max-age=1",
              SearchResultItemConnection: "public, max-age=3",
            },
          });

          const requestData = getRequestData(parsedRequests.nestedUnionQuery);

          await cacheManager.cacheQuery(
            requestData,
            requestData,
            transformResultCacheMetadata(responses.nestedUnionQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery }),
          );

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.nestedUnionQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery }),
          );
        });

        it("no request data", () => {
          expect(analyzeQueryResult?.updated).toBeUndefined();
        });

        it("correct response data", () => {
          expect(analyzeQueryResult?.response).toMatchSnapshot();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });
      });

      describe("defer >>", () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-ignore
          jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
            cascadeCacheControl: true,
          });

          const requestData = getRequestData(parsedRequests.deferQuerySet.updated);

          await new Promise((resolve: (value: void) => void) => {
            const updateResponses = [
              ...responses.deferQuerySet.updated.map(entry => transformResultCacheMetadata(entry)),
            ];

            const interval = setInterval(async () => {
              await cacheManager.cacheQuery(
                requestData,
                requestData,
                updateResponses.shift() as IncrementalRequestManagerResult,
                { awaitDataCaching: true },
                getRequestContext({
                  fieldTypeMap: requestFieldTypeMaps.deferQuery,
                  hasDeferOrStream: true,
                }),
              );

              if (!updateResponses.length) {
                clearInterval(interval);
                resolve();
              }
            }, 50);
          });

          analyzeQueryResult = await cacheManager.analyzeQuery(
            requestData,
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.deferQuery, hasDeferOrStream: true }),
          );
        });

        it("no request data", () => {
          expect(analyzeQueryResult?.updated).toBeUndefined();
        });

        it("correct response data", () => {
          expect(analyzeQueryResult?.response).toMatchSnapshot();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });
      });
    });

    describe("some matching data >>", () => {
      describe("single type >>", () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-ignore
          jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
            typeCacheDirectives: {
              Organization: "public, max-age=1",
            },
          });

          const requestData = getRequestData(parsedRequests.singleTypeQuerySet.initial);

          await cacheManager.cacheQuery(
            requestData,
            requestData,
            transformResultCacheMetadata(responses.singleTypeQuerySet.initial),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
          );

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.singleTypeQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
          );
        });

        it("correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult?.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("no response data", () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });

        it("correct partial data", () => {
          // @ts-ignore
          expect(cacheManager._partialQueryResponses).toMatchSnapshot();
        });
      });

      describe("single type with just ID match >>", () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-ignore
          jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
            typeCacheDirectives: {
              Organization: "public, max-age=1",
            },
          });

          const requestData = getRequestData(parsedRequests.singleTypeQuerySmallA);

          await cacheManager.cacheQuery(
            requestData,
            requestData,
            transformResultCacheMetadata(responses.singleTypeQuerySmallA),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
          );

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.singleTypeQuerySmallB),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
          );
        });

        it("correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult?.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("no response data", () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });

        it("correct partial data", () => {
          // @ts-ignore
          expect(cacheManager._partialQueryResponses).toMatchSnapshot();
        });
      });

      describe("nested type with edges >", () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-ignore
          jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
            typeCacheDirectives: {
              Organization: "public, max-age=3",
              Repository: "public, max-age=2",
              RepositoryConnection: "public, max-age=1",
              RepositoryOwner: "public, max-age=10",
            },
          });

          const requestData = getRequestData(parsedRequests.nestedTypeQuerySet.initial);

          await cacheManager.cacheQuery(
            requestData,
            requestData,
            transformResultCacheMetadata(responses.nestedTypeQuerySet.initial),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
          );

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.nestedTypeQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
          );
        });

        it("correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult?.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("no response data", () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });

        it("correct partial data", () => {
          // @ts-ignore
          expect(cacheManager._partialQueryResponses).toMatchSnapshot();
        });
      });

      describe("nested union with edges >>", () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-ignore
          jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
            typeCacheDirectives: {
              SearchResultItem: "public, max-age=1",
              SearchResultItemConnection: "public, max-age=3",
            },
          });

          const requestData = getRequestData(parsedRequests.nestedUnionQuerySet.initial);

          await cacheManager.cacheQuery(
            requestData,
            requestData,
            transformResultCacheMetadata(responses.nestedUnionQuerySet.initial),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery }),
          );

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.nestedUnionQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery }),
          );
        });

        it("correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult?.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("no response data", () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });

        it("correct partial data", () => {
          // @ts-ignore
          expect(cacheManager._partialQueryResponses).toMatchSnapshot();
        });
      });

      describe("fragment spreads >> within fragment spreads >>", () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-ignore
          jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
            cascadeCacheControl: true,
          });

          const requestData = getRequestData(parsedRequests.getSearchResultsQuery);

          await cacheManager.cacheQuery(
            requestData,
            requestData,
            transformResultCacheMetadata(responses.getSearchResultsQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.getSearchResultsQuery, hasDeferOrStream: true }),
          );

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.getMoviePreviewQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.getMoviePreviewQuery, hasDeferOrStream: true }),
          );
        });

        it("correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult?.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("no response data", () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });

        it("correct partial data", () => {
          // @ts-ignore
          expect(cacheManager._partialQueryResponses).toMatchSnapshot();
        });
      });

      describe("defer >>", () => {
        beforeAll(async () => {
          analyzeQueryResult = undefined;
          // @ts-ignore
          jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

          cacheManager = new CacheManager({
            cache: new Cachemap({
              name: "cachemap",
              store: map(),
              type: "someType",
            }),
            cascadeCacheControl: true,
          });

          const requestData = getRequestData(parsedRequests.deferQuerySet.initial);

          await cacheManager.cacheQuery(
            requestData,
            requestData,
            transformResultCacheMetadata(responses.deferQuerySet.initial),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.deferQuery, hasDeferOrStream: true }),
          );

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.deferQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.deferQuery, hasDeferOrStream: true }),
          );
        });

        it("correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult?.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("no response data", () => {
          expect(analyzeQueryResult?.response).toBeUndefined();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });

        it("correct partial data", () => {
          // @ts-ignore
          expect(cacheManager._partialQueryResponses).toMatchSnapshot();
        });
      });
    });
  });
});
