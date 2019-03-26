import Cachemap from "@cachemap/core";
import map from "@cachemap/map";
import { CACHE_ENTRY_ADDED, CacheManager } from "@handl/cache-manager";
import { DEFAULT_TYPE_ID_KEY, PlainObjectMap } from "@handl/core";
import {
  getRequestContext,
  getRequestData,
  parsedRequests,
  requestFieldTypeMaps,
  responses,
} from "@handl/test-utils";
import { DebugManager } from ".";

describe("@handl/debug-manager >>", () => {
  let debugManager: DebugManager;
  const response: PlainObjectMap[] = [];

  describe("CacheManager >> CACHE_ENTRY_ADDED >>", () => {
    beforeAll(async () => {
      debugManager = await DebugManager.init();

      debugManager.on(CACHE_ENTRY_ADDED, (payload: PlainObjectMap) => {
        response.push(payload);
      });

      const cacheManager = await CacheManager.init({
        cache: await Cachemap.init({
          name: "cachemap",
          store: map(),
        }),
        cascadeCacheControl: true,
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const requestData = getRequestData(parsedRequests.singleTypeQuery);

      await cacheManager.resolveQuery(
        requestData,
        requestData,
        responses.singleTypeQuery,
        { awaitDataCaching: true },
        getRequestContext({ debugManager, fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
      );
    });

    it("correct data emitted", () => {
      expect(response).toMatchSnapshot();
    });
  });
});
