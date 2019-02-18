import Core from "@cachemap/core";
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

    describe("when caching is done through cascading cache control", () => {
      beforeAll(async () => {
        cacheManager = await CacheManager.init({
          cache: await Core.init({
            name: "cachemap",
            store: map(),
          }),
          cascadeCacheControl: true,
          typeIDKey: DEFAULT_TYPE_ID_KEY,
        });

        requestData = getRequestData(githubParsedQueries.simple);

        responseData = await cacheManager.resolveQuery(
          requestData,
          requestData,
          githubQueryResponses.simple,
          { awaitDataCaching: true },
          getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.simple }),
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
          cache: await Core.init({
            name: "cachemap",
            store: map(),
          }),
          typeCacheDirectives: {
            Organization: "public, max-age=1",
          },
          typeIDKey: DEFAULT_TYPE_ID_KEY,
        });

        requestData = getRequestData(githubParsedQueries.simple);

        responseData = await cacheManager.resolveQuery(
          requestData,
          requestData,
          githubQueryResponses.simple,
          { awaitDataCaching: true },
          getRequestContext({ fieldTypeMap: githubQueryFieldTypeMaps.simple }),
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
