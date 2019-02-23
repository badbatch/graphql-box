import Cachemap from "@cachemap/core";
import map from "@cachemap/map";
import { RequestData, ResponseData } from "@handl/core";
import {
  getRequestContext,
  getRequestData,
  githubParsedQueries,
  githubQueryFieldTypeMaps,
  githubQueryResponses,
} from "@handl/test-utils";
import { CacheManager, CacheManagerDef } from ".";
import { DEFAULT_TYPE_ID_KEY } from "./consts";

describe("@handl/cache-manager", () => {
  let cacheManager: CacheManagerDef;

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
  });
});
