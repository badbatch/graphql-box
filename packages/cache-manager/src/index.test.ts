import Cachemap from "@cachemap/core";
import map from "@cachemap/map";
import { DehydratedCacheMetadata, RequestData, ResponseData } from "@handl/core";
import {
  getRequestContext,
  getRequestData,
  parsedRequests,
  requestFieldTypeMaps,
  responses,
} from "@handl/test-utils";
import { CacheManager, CacheManagerDef } from ".";
import { DEFAULT_TYPE_ID_KEY, MUTATION } from "./consts";
import { AnalyzeQueryResult } from "./defs";
import { rehydrateCacheMetadata } from "./helpers/cache-metadata";

describe("@handl/cache-manager >>", () => {
  const realDateNow = Date.now.bind(global.Date);
  let cacheManager: CacheManagerDef;

  beforeAll(() => {
    global.Date.now = jest.fn().mockReturnValue(Date.parse("June 6, 1979"));
  });

  afterAll(() => {
    global.Date.now = realDateNow;
  });

  describe("resolve >>", () => {
    let responseData: ResponseData;
    let requestData: RequestData;

    describe("mutation >> nested interface >>", () => {
      describe("cascading cache control >>", () => {
        beforeAll(async () => {
          cacheManager = await CacheManager.init({
            cache: await Cachemap.init({
              name: "cachemap",
              store: map(),
            }),
            cascadeCacheControl: true,
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          requestData = getRequestData(parsedRequests.nestedInterfaceMutation);

          responseData = await cacheManager.resolveRequest(
            requestData,
            responses.nestedInterfaceMutation,
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
          cacheManager = await CacheManager.init({
            cache: await Cachemap.init({
              name: "cachemap",
              store: map(),
            }),
            typeCacheDirectives: {
              AddStarPayload: "no-cache, no-store",
              StargazerConnection: "public, max-age=1",
              StargazerEdge: "public, max-age=1",
              Starrable: "public, max-age=10",
              User: "public, max-age=5",
            },
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          requestData = getRequestData(parsedRequests.nestedInterfaceMutation);

          responseData = await cacheManager.resolveRequest(
            requestData,
            responses.nestedInterfaceMutation,
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
  });

  describe("resolveQuery >>", () => {
    let responseData: ResponseData;
    let requestData: RequestData;

    describe("not filtered >>", () => {
      describe("single type >>", () => {
        describe("cascading cache control >>", () => {
          beforeAll(async () => {
            cacheManager = await CacheManager.init({
              cache: await Cachemap.init({
                name: "cachemap",
                store: map(),
              }),
              cascadeCacheControl: true,
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.singleTypeQuery);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              responses.singleTypeQuery,
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
            cacheManager = await CacheManager.init({
              cache: await Cachemap.init({
                name: "cachemap",
                store: map(),
              }),
              typeCacheDirectives: {
                Organization: "public, max-age=1",
              },
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.singleTypeQuery);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              responses.singleTypeQuery,
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
            cacheManager = await CacheManager.init({
              cache: await Cachemap.init({
                name: "cachemap",
                store: map(),
              }),
              cascadeCacheControl: true,
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.nestedTypeQuery);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              responses.nestedTypeQuery,
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
            cacheManager = await CacheManager.init({
              cache: await Cachemap.init({
                name: "cachemap",
                store: map(),
              }),
              typeCacheDirectives: {
                Organization: "public, max-age=3",
                Repository: "public, max-age=2",
                RepositoryConnection: "public, max-age=1",
                RepositoryOwner: "public, max-age=10",
              },
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.nestedTypeQuery);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              responses.nestedTypeQuery,
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
            cacheManager = await CacheManager.init({
              cache: await Cachemap.init({
                name: "cachemap",
                store: map(),
              }),
              cascadeCacheControl: true,
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.nestedUnionQuery);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              responses.nestedUnionQuery,
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
            cacheManager = await CacheManager.init({
              cache: await Cachemap.init({
                name: "cachemap",
                store: map(),
              }),
              typeCacheDirectives: {
                SearchResultItem: "public, max-age=1",
                SearchResultItemConnection: "public, max-age=3",
              },
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.nestedUnionQuery);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              responses.nestedUnionQuery,
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
            // @ts-ignore
            jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

            cacheManager = await CacheManager.init({
              cache: await Cachemap.init({
                name: "cachemap",
                store: map(),
              }),
              cascadeCacheControl: true,
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.singleTypeQuerySet.initial);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              responses.singleTypeQuerySet.initial,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
            );

            const { cacheMetadata, data } = responses.singleTypeQuerySet.partial;

            // @ts-ignore
            jest.spyOn(cacheManager._partialQueryResponses, "get").mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata as DehydratedCacheMetadata),
              data,
            });

            responseData = await cacheManager.resolveQuery(
              getRequestData(parsedRequests.singleTypeQuerySet.full),
              getRequestData(parsedRequests.singleTypeQuerySet.updated),
              responses.singleTypeQuerySet.updated,
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
            // @ts-ignore
            jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

            cacheManager = await CacheManager.init({
              cache: await Cachemap.init({
                name: "cachemap",
                store: map(),
              }),
              typeCacheDirectives: {
                Organization: "public, max-age=1",
              },
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.singleTypeQuerySet.initial);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              responses.singleTypeQuerySet.initial,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
            );

            const { cacheMetadata, data } = responses.singleTypeQuerySet.partial;

            // @ts-ignore
            jest.spyOn(cacheManager._partialQueryResponses, "get").mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata as DehydratedCacheMetadata),
              data,
            });

            responseData = await cacheManager.resolveQuery(
              getRequestData(parsedRequests.singleTypeQuerySet.full),
              getRequestData(parsedRequests.singleTypeQuerySet.updated),
              responses.singleTypeQuerySet.updated,
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
            // @ts-ignore
            jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

            cacheManager = await CacheManager.init({
              cache: await Cachemap.init({
                name: "cachemap",
                store: map(),
              }),
              cascadeCacheControl: true,
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.nestedTypeQuerySet.initial);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              responses.nestedTypeQuerySet.initial,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
            );

            const { cacheMetadata, data } = responses.nestedTypeQuerySet.partial;

            // @ts-ignore
            jest.spyOn(cacheManager._partialQueryResponses, "get").mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata as DehydratedCacheMetadata),
              data,
            });

            responseData = await cacheManager.resolveQuery(
              getRequestData(parsedRequests.nestedTypeQuerySet.full),
              getRequestData(parsedRequests.nestedTypeQuerySet.updated),
              responses.nestedTypeQuerySet.updated,
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
            // @ts-ignore
            jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

            cacheManager = await CacheManager.init({
              cache: await Cachemap.init({
                name: "cachemap",
                store: map(),
              }),
              typeCacheDirectives: {
                Organization: "public, max-age=3",
                Repository: "public, max-age=2",
                RepositoryConnection: "public, max-age=1",
                RepositoryOwner: "public, max-age=10",
              },
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.nestedTypeQuerySet.initial);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              responses.nestedTypeQuerySet.initial,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
            );

            const { cacheMetadata, data } = responses.nestedTypeQuerySet.partial;

            // @ts-ignore
            jest.spyOn(cacheManager._partialQueryResponses, "get").mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata as DehydratedCacheMetadata),
              data,
            });

            responseData = await cacheManager.resolveQuery(
              getRequestData(parsedRequests.nestedTypeQuerySet.full),
              getRequestData(parsedRequests.nestedTypeQuerySet.updated),
              responses.nestedTypeQuerySet.updated,
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
            // @ts-ignore
            jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

            cacheManager = await CacheManager.init({
              cache: await Cachemap.init({
                name: "cachemap",
                store: map(),
              }),
              cascadeCacheControl: true,
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.nestedUnionQuerySet.initial);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              responses.nestedUnionQuerySet.initial,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery }),
            );

            const { cacheMetadata, data } = responses.nestedUnionQuerySet.partial;

            // @ts-ignore
            jest.spyOn(cacheManager._partialQueryResponses, "get").mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata as DehydratedCacheMetadata),
              data,
            });

            responseData = await cacheManager.resolveQuery(
              getRequestData(parsedRequests.nestedUnionQuerySet.full),
              getRequestData(parsedRequests.nestedUnionQuerySet.updated),
              responses.nestedUnionQuerySet.updated,
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
            // @ts-ignore
            jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

            cacheManager = await CacheManager.init({
              cache: await Cachemap.init({
                name: "cachemap",
                store: map(),
              }),
              typeCacheDirectives: {
                SearchResultItem: "public, max-age=1",
                SearchResultItemConnection: "public, max-age=3",
              },
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(parsedRequests.nestedUnionQuerySet.initial);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              responses.nestedUnionQuerySet.initial,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery }),
            );

            const { cacheMetadata, data } = responses.nestedUnionQuerySet.partial;

            // @ts-ignore
            jest.spyOn(cacheManager._partialQueryResponses, "get").mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata as DehydratedCacheMetadata),
              data,
            });

            responseData = await cacheManager.resolveQuery(
              getRequestData(parsedRequests.nestedUnionQuerySet.full),
              getRequestData(parsedRequests.nestedUnionQuerySet.updated),
              responses.nestedUnionQuerySet.updated,
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
    });
  });

  describe("analyzeQuery >>", () => {
    let analyzeQueryResult: AnalyzeQueryResult;

    describe("no matching data >>", () => {
      describe("single type >>", () => {
        beforeAll(async () => {
          cacheManager = await CacheManager.init({
            cache: await Cachemap.init({
              name: "cachemap",
              store: map(),
            }),
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.singleTypeQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
          );
        });

        it("correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("no response data", () => {
          expect(analyzeQueryResult.response).toBeUndefined();
        });
      });

      describe("nested type with edges >>", () => {
        beforeAll(async () => {
          cacheManager = await CacheManager.init({
            cache: await Cachemap.init({
              name: "cachemap",
              store: map(),
            }),
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.nestedTypeQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedTypeQuery }),
          );
        });

        it("correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("no response data", () => {
          expect(analyzeQueryResult.response).toBeUndefined();
        });
      });

      describe("nested union with edges >>", () => {
        beforeAll(async () => {
          cacheManager = await CacheManager.init({
            cache: await Cachemap.init({
              name: "cachemap",
              store: map(),
            }),
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(parsedRequests.nestedUnionQuery),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: requestFieldTypeMaps.nestedUnionQuery }),
          );
        });

        it("correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("no response data", () => {
          expect(analyzeQueryResult.response).toBeUndefined();
        });
      });
    });

    describe("entire matching data >>", () => {
      describe("single type >>", () => {
        beforeAll(async () => {
          // @ts-ignore
          jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

          cacheManager = await CacheManager.init({
            cache: await Cachemap.init({
              name: "cachemap",
              store: map(),
            }),
            typeCacheDirectives: {
              Organization: "public, max-age=1",
            },
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          const requestData = getRequestData(parsedRequests.singleTypeQuery);

          await cacheManager.resolveQuery(
            requestData,
            requestData,
            responses.singleTypeQuery,
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
          expect(analyzeQueryResult.updated).toBeUndefined();
        });

        it("correct response data", () => {
          expect(analyzeQueryResult.response).toMatchSnapshot();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });
      });

      describe("nested type with edges >>", () => {
        beforeAll(async () => {
          // @ts-ignore
          jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

          cacheManager = await CacheManager.init({
            cache: await Cachemap.init({
              name: "cachemap",
              store: map(),
            }),
            typeCacheDirectives: {
              Organization: "public, max-age=3",
              Repository: "public, max-age=2",
              RepositoryConnection: "public, max-age=1",
              RepositoryOwner: "public, max-age=10",
            },
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          const requestData = getRequestData(parsedRequests.nestedTypeQuery);

          await cacheManager.resolveQuery(
            requestData,
            requestData,
            responses.nestedTypeQuery,
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
          expect(analyzeQueryResult.updated).toBeUndefined();
        });

        it("correct response data", () => {
          expect(analyzeQueryResult.response).toMatchSnapshot();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });
      });

      describe("nested union with edges >>", () => {
        beforeAll(async () => {
          // @ts-ignore
          jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

          cacheManager = await CacheManager.init({
            cache: await Cachemap.init({
              name: "cachemap",
              store: map(),
            }),
            typeCacheDirectives: {
              SearchResultItem: "public, max-age=1",
              SearchResultItemConnection: "public, max-age=3",
            },
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          const requestData = getRequestData(parsedRequests.nestedUnionQuery);

          await cacheManager.resolveQuery(
            requestData,
            requestData,
            responses.nestedUnionQuery,
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
          expect(analyzeQueryResult.updated).toBeUndefined();
        });

        it("correct response data", () => {
          expect(analyzeQueryResult.response).toMatchSnapshot();
        });

        it("correct cache data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });
      });
    });

    describe("some matching data >>", () => {
      describe("single type >>", () => {
        beforeAll(async () => {
          // @ts-ignore
          jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

          cacheManager = await CacheManager.init({
            cache: await Cachemap.init({
              name: "cachemap",
              store: map(),
            }),
            typeCacheDirectives: {
              Organization: "public, max-age=1",
            },
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          const requestData = getRequestData(parsedRequests.singleTypeQuerySet.initial);

          await cacheManager.resolveQuery(
            requestData,
            requestData,
            responses.singleTypeQuerySet.initial,
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
          const { ast, ...otherProps } = analyzeQueryResult.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("no response data", () => {
          expect(analyzeQueryResult.response).toBeUndefined();
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
          // @ts-ignore
          jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

          cacheManager = await CacheManager.init({
            cache: await Cachemap.init({
              name: "cachemap",
              store: map(),
            }),
            typeCacheDirectives: {
              Organization: "public, max-age=3",
              Repository: "public, max-age=2",
              RepositoryConnection: "public, max-age=1",
              RepositoryOwner: "public, max-age=10",
            },
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          const requestData = getRequestData(parsedRequests.nestedTypeQuerySet.initial);

          await cacheManager.resolveQuery(
            requestData,
            requestData,
            responses.nestedTypeQuerySet.initial,
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
          const { ast, ...otherProps } = analyzeQueryResult.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("no response data", () => {
          expect(analyzeQueryResult.response).toBeUndefined();
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
          // @ts-ignore
          jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

          cacheManager = await CacheManager.init({
            cache: await Cachemap.init({
              name: "cachemap",
              store: map(),
            }),
            typeCacheDirectives: {
              SearchResultItem: "public, max-age=1",
              SearchResultItemConnection: "public, max-age=3",
            },
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          const requestData = getRequestData(parsedRequests.nestedUnionQuerySet.initial);

          await cacheManager.resolveQuery(
            requestData,
            requestData,
            responses.nestedUnionQuerySet.initial,
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
          const { ast, ...otherProps } = analyzeQueryResult.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("no response data", () => {
          expect(analyzeQueryResult.response).toBeUndefined();
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
