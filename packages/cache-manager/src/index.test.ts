import Cachemap from "@cachemap/core";
import map from "@cachemap/map";
import { DehydratedCacheMetadata, RequestData, ResponseData } from "@handl/core";
import {
  getRequestContext,
  getRequestData,
  githubParsedQueries,
  githubQueryFieldTypeMaps,
  githubQueryResponses,
} from "@handl/test-utils";
import { CacheManager, CacheManagerDef } from ".";
import { DEFAULT_TYPE_ID_KEY } from "./consts";
import { AnalyzeQueryResult } from "./defs";
import { rehydrateCacheMetadata } from "./helpers/cache-metadata";

describe("@handl/cache-manager", () => {
  const realDateNow = Date.now.bind(global.Date);
  let cacheManager: CacheManagerDef;

  beforeAll(() => {
    global.Date.now = jest.fn().mockReturnValue(Date.parse("June 6, 1979"));
  });

  afterAll(() => {
    global.Date.now = realDateNow;
  });

  describe("the resolveQuery method", () => {
    let responseData: ResponseData;
    let requestData: RequestData;

    describe("when the query has not been filtered", () => {
      describe("with a single type query", () => {
        describe("when caching is done through cascading cache control", () => {
          beforeAll(async () => {
            cacheManager = await CacheManager.init({
              cache: await Cachemap.init({
                name: "cachemap",
                store: map(),
              }),
              cascadeCacheControl: true,
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(githubParsedQueries.singleType);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              githubQueryResponses.singleType,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.singleType }),
            );
          });

          it("then the method should return the correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("then the cache should contain the correct data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });

        describe("when caching is done through type cache directives", () => {
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

            requestData = getRequestData(githubParsedQueries.singleType);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              githubQueryResponses.singleType,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.singleType }),
            );
          });

          it("then the method should return the correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("then the cache should contain the correct data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });
      });

      describe("with a nested type with edges query", () => {
        describe("when caching is done through cascading cache control", () => {
          beforeAll(async () => {
            cacheManager = await CacheManager.init({
              cache: await Cachemap.init({
                name: "cachemap",
                store: map(),
              }),
              cascadeCacheControl: true,
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(githubParsedQueries.nestedTypeWithEdges);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              githubQueryResponses.nestedTypeWithEdges,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedTypeWithEdges }),
            );
          });

          it("then the method should return the correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("then the cache should contain the correct data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });

        describe("when caching is done through type cache directives", () => {
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

            requestData = getRequestData(githubParsedQueries.nestedTypeWithEdges);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              githubQueryResponses.nestedTypeWithEdges,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedTypeWithEdges }),
            );
          });

          it("then the method should return the correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("then the cache should contain the correct data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });
      });

      describe("with a nested union with edges query", () => {
        describe("when caching is done through cascading cache control", () => {
          beforeAll(async () => {
            cacheManager = await CacheManager.init({
              cache: await Cachemap.init({
                name: "cachemap",
                store: map(),
              }),
              cascadeCacheControl: true,
              typeIDKey: DEFAULT_TYPE_ID_KEY,
            });

            requestData = getRequestData(githubParsedQueries.nestedUnionWithEdges);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              githubQueryResponses.nestedUnionWithEdges,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedUnionWithEdges }),
            );
          });

          it("then the method should return the correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("then the cache should contain the correct data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });

        describe("when caching is done through type cache directives", () => {
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

            requestData = getRequestData(githubParsedQueries.nestedUnionWithEdges);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              githubQueryResponses.nestedUnionWithEdges,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedUnionWithEdges }),
            );
          });

          it("then the method should return the correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("then the cache should contain the correct data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });
      });
    });

    describe("when the query has been filtered", () => {
      describe("with a single type query", () => {
        describe("when caching is done through cascading cache control", () => {
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

            requestData = getRequestData(githubParsedQueries.singleTypeWithFilter.initial);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              githubQueryResponses.singleTypePartialAndFilter.initial,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.singleType }),
            );

            const { cacheMetadata, data } = githubQueryResponses.singleTypePartialAndFilter.partial;

            // @ts-ignore
            jest.spyOn(cacheManager._partialQueryResponses, "get").mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata as DehydratedCacheMetadata),
              data,
            });

            responseData = await cacheManager.resolveQuery(
              getRequestData(githubParsedQueries.singleTypeWithFilter.full),
              getRequestData(githubParsedQueries.singleTypeWithFilter.updated),
              githubQueryResponses.singleTypePartialAndFilter.updated,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.singleType, queryFiltered: true }),
            );
          });

          it("then the method should return the correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("then the cache should contain the correct data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });

        describe("when caching is done through type cache directives", () => {
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

            requestData = getRequestData(githubParsedQueries.singleTypeWithFilter.initial);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              githubQueryResponses.singleTypePartialAndFilter.initial,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.singleType }),
            );

            const { cacheMetadata, data } = githubQueryResponses.singleTypePartialAndFilter.partial;

            // @ts-ignore
            jest.spyOn(cacheManager._partialQueryResponses, "get").mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata as DehydratedCacheMetadata),
              data,
            });

            responseData = await cacheManager.resolveQuery(
              getRequestData(githubParsedQueries.singleTypeWithFilter.full),
              getRequestData(githubParsedQueries.singleTypeWithFilter.updated),
              githubQueryResponses.singleTypePartialAndFilter.updated,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.singleType, queryFiltered: true }),
            );
          });

          it("then the method should return the correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("then the cache should contain the correct data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });
      });

      describe("with a nested type with edges query", () => {
        describe("when caching is done through cascading cache control", () => {
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

            requestData = getRequestData(githubParsedQueries.nestedTypeWithEdgesWithFilter.initial);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              githubQueryResponses.nestedTypeWithEdgesPartialAndFilter.initial,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedTypeWithEdges }),
            );

            const { cacheMetadata, data } = githubQueryResponses.nestedTypeWithEdgesPartialAndFilter.partial;

            // @ts-ignore
            jest.spyOn(cacheManager._partialQueryResponses, "get").mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata as DehydratedCacheMetadata),
              data,
            });

            responseData = await cacheManager.resolveQuery(
              getRequestData(githubParsedQueries.nestedTypeWithEdgesWithFilter.full),
              getRequestData(githubParsedQueries.nestedTypeWithEdgesWithFilter.updated),
              githubQueryResponses.nestedTypeWithEdgesPartialAndFilter.updated,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedTypeWithEdges, queryFiltered: true }),
            );
          });

          it("then the method should return the correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("then the cache should contain the correct data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });

        describe("when caching is done through type cache directives", () => {
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

            requestData = getRequestData(githubParsedQueries.nestedTypeWithEdgesWithFilter.initial);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              githubQueryResponses.nestedTypeWithEdgesPartialAndFilter.initial,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedTypeWithEdges }),
            );

            const { cacheMetadata, data } = githubQueryResponses.nestedTypeWithEdgesPartialAndFilter.partial;

            // @ts-ignore
            jest.spyOn(cacheManager._partialQueryResponses, "get").mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata as DehydratedCacheMetadata),
              data,
            });

            responseData = await cacheManager.resolveQuery(
              getRequestData(githubParsedQueries.nestedTypeWithEdgesWithFilter.full),
              getRequestData(githubParsedQueries.nestedTypeWithEdgesWithFilter.updated),
              githubQueryResponses.nestedTypeWithEdgesPartialAndFilter.updated,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedTypeWithEdges, queryFiltered: true }),
            );
          });

          it("then the method should return the correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("then the cache should contain the correct data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });
      });

      describe("with a nested union with edges query", () => {
        describe("when caching is done through cascading cache control", () => {
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

            requestData = getRequestData(githubParsedQueries.nestedUnionWithEdgesWithFilter.initial);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              githubQueryResponses.nestedUnionWithEdgesPartialAndFilter.initial,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedUnionWithEdges }),
            );

            const { cacheMetadata, data } = githubQueryResponses.nestedUnionWithEdgesPartialAndFilter.partial;

            // @ts-ignore
            jest.spyOn(cacheManager._partialQueryResponses, "get").mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata as DehydratedCacheMetadata),
              data,
            });

            responseData = await cacheManager.resolveQuery(
              getRequestData(githubParsedQueries.nestedUnionWithEdgesWithFilter.full),
              getRequestData(githubParsedQueries.nestedUnionWithEdgesWithFilter.updated),
              githubQueryResponses.nestedUnionWithEdgesPartialAndFilter.updated,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedUnionWithEdges, queryFiltered: true }),
            );
          });

          it("then the method should return the correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("then the cache should contain the correct data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });

        describe("when caching is done through type cache directives", () => {
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

            requestData = getRequestData(githubParsedQueries.nestedUnionWithEdgesWithFilter.initial);

            responseData = await cacheManager.resolveQuery(
              requestData,
              requestData,
              githubQueryResponses.nestedUnionWithEdgesPartialAndFilter.initial,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedUnionWithEdges }),
            );

            const { cacheMetadata, data } = githubQueryResponses.nestedUnionWithEdgesPartialAndFilter.partial;

            // @ts-ignore
            jest.spyOn(cacheManager._partialQueryResponses, "get").mockReturnValue({
              cacheMetadata: rehydrateCacheMetadata(cacheMetadata as DehydratedCacheMetadata),
              data,
            });

            responseData = await cacheManager.resolveQuery(
              getRequestData(githubParsedQueries.nestedUnionWithEdgesWithFilter.full),
              getRequestData(githubParsedQueries.nestedUnionWithEdgesWithFilter.updated),
              githubQueryResponses.nestedUnionWithEdgesPartialAndFilter.updated,
              { awaitDataCaching: true },
              getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedUnionWithEdges, queryFiltered: true }),
            );
          });

          it("then the method should return the correct response data", () => {
            expect(responseData).toMatchSnapshot();
          });

          it("then the cache should contain the correct data", async () => {
            expect(await cacheManager.cache.export()).toMatchSnapshot();
          });
        });
      });
    });
  });

  describe("the analyzeQuery method", () => {
    let analyzeQueryResult: AnalyzeQueryResult;

    describe("with a single type query", () => {
      describe("when there is no matching data for the request in the cache", () => {
        beforeAll(async () => {
          cacheManager = await CacheManager.init({
            cache: await Cachemap.init({
              name: "cachemap",
              store: map(),
            }),
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(githubParsedQueries.singleType),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.singleType }),
          );
        });

        it("then the method should return the correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("then the method should not return any response data", () => {
          expect(analyzeQueryResult.response).toBeUndefined();
        });
      });

      describe("when there is matching data for the entire request in the cache", () => {
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

          const requestData = getRequestData(githubParsedQueries.singleType);

          await cacheManager.resolveQuery(
            requestData,
            requestData,
            githubQueryResponses.singleType,
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.singleType }),
          );

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(githubParsedQueries.singleType),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.singleType }),
          );
        });

        it("then the method not return any request data", () => {
          expect(analyzeQueryResult.updated).toBeUndefined();
        });

        it("then the method should return the correct response data", () => {
          expect(analyzeQueryResult.response).toMatchSnapshot();
        });

        it("then the cache should contain the correct data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });
      });

      describe("when there is matching data for some of the request in the cache", () => {
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

          const requestData = getRequestData(githubParsedQueries.singleTypeWithFilter.initial);

          await cacheManager.resolveQuery(
            requestData,
            requestData,
            githubQueryResponses.singleTypePartialAndFilter.initial,
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.singleType }),
          );

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(githubParsedQueries.singleType),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.singleType }),
          );
        });

        it("then the method should return the correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("then the method should not return any response data", () => {
          expect(analyzeQueryResult.response).toBeUndefined();
        });

        it("then the cache should contain the correct data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });

        it("then the partial query response map should contain the correct data", () => {
          // @ts-ignore
          expect(cacheManager._partialQueryResponses).toMatchSnapshot();
        });
      });
    });

    describe("with a nested type with edges query", () => {
      describe("when there is no matching data for the request in the cache", () => {
        beforeAll(async () => {
          cacheManager = await CacheManager.init({
            cache: await Cachemap.init({
              name: "cachemap",
              store: map(),
            }),
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(githubParsedQueries.nestedTypeWithEdges),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedTypeWithEdges }),
          );
        });

        it("then the method should return the correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("then the method should not return any response data", () => {
          expect(analyzeQueryResult.response).toBeUndefined();
        });
      });

      describe("when there is matching data for the entire request in the cache", () => {
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

          const requestData = getRequestData(githubParsedQueries.nestedTypeWithEdges);

          await cacheManager.resolveQuery(
            requestData,
            requestData,
            githubQueryResponses.nestedTypeWithEdges,
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedTypeWithEdges }),
          );

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(githubParsedQueries.nestedTypeWithEdges),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedTypeWithEdges }),
          );
        });

        it("then the method not return any request data", () => {
          expect(analyzeQueryResult.updated).toBeUndefined();
        });

        it("then the method should return the correct response data", () => {
          expect(analyzeQueryResult.response).toMatchSnapshot();
        });

        it("then the cache should contain the correct data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });
      });

      describe("when there is matching data for some of the request in the cache", () => {
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

          const requestData = getRequestData(githubParsedQueries.nestedTypeWithEdgesWithFilter.initial);

          await cacheManager.resolveQuery(
            requestData,
            requestData,
            githubQueryResponses.nestedTypeWithEdgesPartialAndFilter.initial,
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedTypeWithEdges }),
          );

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(githubParsedQueries.nestedTypeWithEdges),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedTypeWithEdges }),
          );
        });

        it("then the method should return the correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("then the method should not return any response data", () => {
          expect(analyzeQueryResult.response).toBeUndefined();
        });

        it("then the cache should contain the correct data", async () => {
          expect(await cacheManager.cache.export()).toMatchSnapshot();
        });

        it("then the partial query response map should contain the correct data", () => {
          // @ts-ignore
          expect(cacheManager._partialQueryResponses).toMatchSnapshot();
        });
      });
    });

    describe("with a nested union with edges query", () => {
      describe("when there is no matching data for the request in the cache", () => {
        beforeAll(async () => {
          cacheManager = await CacheManager.init({
            cache: await Cachemap.init({
              name: "cachemap",
              store: map(),
            }),
            typeIDKey: DEFAULT_TYPE_ID_KEY,
          });

          analyzeQueryResult = await cacheManager.analyzeQuery(
            getRequestData(githubParsedQueries.nestedUnionWithEdges),
            { awaitDataCaching: true },
            getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedUnionWithEdges }),
          );
        });

        it("then the method should return the correct request data", () => {
          const { ast, ...otherProps } = analyzeQueryResult.updated as RequestData;
          expect(otherProps).toMatchSnapshot();
        });

        it("then the method should not return any response data", () => {
          expect(analyzeQueryResult.response).toBeUndefined();
        });
      });

      // describe("when there is matching data for the entire request in the cache", () => {
      //   beforeAll(async () => {
      //     // @ts-ignore
      //     jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

      //     cacheManager = await CacheManager.init({
      //       cache: await Cachemap.init({
      //         name: "cachemap",
      //         store: map(),
      //       }),
      //       typeCacheDirectives: {
      //         SearchResultItem: "public, max-age=1",
      //         SearchResultItemConnection: "public, max-age=3",
      //       },
      //       typeIDKey: DEFAULT_TYPE_ID_KEY,
      //     });

      //     const requestData = getRequestData(githubParsedQueries.nestedUnionWithEdges);

      //     await cacheManager.resolveQuery(
      //       requestData,
      //       requestData,
      //       githubQueryResponses.nestedUnionWithEdges,
      //       { awaitDataCaching: true },
      //       getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedUnionWithEdges }),
      //     );

      //     analyzeQueryResult = await cacheManager.analyzeQuery(
      //       getRequestData(githubParsedQueries.nestedUnionWithEdges),
      //       { awaitDataCaching: true },
      //       getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedUnionWithEdges }),
      //     );
      //   });

      //   it("then the method not return any request data", () => {
      //     expect(analyzeQueryResult.updated).toBeUndefined();
      //   });

      //   it("then the method should return the correct response data", () => {
      //     expect(analyzeQueryResult.response).toMatchSnapshot();
      //   });

      //   it("then the cache should contain the correct data", async () => {
      //     expect(await cacheManager.cache.export()).toMatchSnapshot();
      //   });
      // });

      // describe("when there is matching data for some of the request in the cache", () => {
      //   beforeAll(async () => {
      //     // @ts-ignore
      //     jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

      //     cacheManager = await CacheManager.init({
      //       cache: await Cachemap.init({
      //         name: "cachemap",
      //         store: map(),
      //       }),
      //       typeCacheDirectives: {
      //         SearchResultItem: "public, max-age=1",
      //         SearchResultItemConnection: "public, max-age=3",
      //       },
      //       typeIDKey: DEFAULT_TYPE_ID_KEY,
      //     });

      //     const requestData = getRequestData(githubParsedQueries.nestedUnionWithEdgesWithFilter.initial);

      //     await cacheManager.resolveQuery(
      //       requestData,
      //       requestData,
      //       githubQueryResponses.nestedUnionWithEdgesPartialAndFilter.initial,
      //       { awaitDataCaching: true },
      //       getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedUnionWithEdges }),
      //     );

      //     analyzeQueryResult = await cacheManager.analyzeQuery(
      //       getRequestData(githubParsedQueries.nestedUnionWithEdges),
      //       { awaitDataCaching: true },
      //       getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.nestedUnionWithEdges }),
      //     );
      //   });

      //   it("then the method should return the correct request data", () => {
      //     const { ast, ...otherProps } = analyzeQueryResult.updated as RequestData;
      //     expect(otherProps).toMatchSnapshot();
      //   });

      //   it("then the method should not return any response data", () => {
      //     expect(analyzeQueryResult.response).toBeUndefined();
      //   });

      //   it("then the cache should contain the correct data", async () => {
      //     expect(await cacheManager.cache.export()).toMatchSnapshot();
      //   });

      //   it("then the partial query response map should contain the correct data", () => {
      //     // @ts-ignore
      //     expect(cacheManager._partialQueryResponses).toMatchSnapshot();
      //   });
      // });
    });
  });
});
