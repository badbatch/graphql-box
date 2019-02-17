import Core from "@cachemap/core";
import map from "@cachemap/map";
import { RequestData, RequestOptions, ResponseData } from "@handl/core";
import { getRequestContext, getRequestData, githubParsedQueries, githubQueryResponses } from "@handl/test-utils";
import { CacheManager, CacheManagerDef } from ".";
import { DEFAULT_TYPE_ID_KEY } from "./consts";

describe("@handl/cache-manager", () => {
  let cacheManager: CacheManagerDef;

  beforeAll(async () => {
    cacheManager = await CacheManager.init({
      cache: await Core.init({
        name: "cachemap",
        store: map(),
      }),
      cascadeCacheControl: true,
      typeIDKey: DEFAULT_TYPE_ID_KEY,
    });
  });

  describe("the resolveQuery method", () => {
    let responseData: ResponseData;
    let requestData: RequestData;

    describe("when the query has not been filtered", () => {
      beforeAll(async () => {
        requestData = getRequestData(githubParsedQueries.organizationSmall);
        const options: RequestOptions = { awaitDataCaching: true };
        const requestContext = getRequestContext();

        responseData = await cacheManager.resolveQuery(
          requestData,
          requestData,
          githubQueryResponses.organizationSmall,
          options,
          requestContext,
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
