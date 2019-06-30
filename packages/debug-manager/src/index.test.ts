import Cachemap from "@cachemap/core";
import map from "@cachemap/map";
import { CACHE_ENTRY_ADDED, CACHE_ENTRY_QUERIED, CacheManager } from "@graphql-box/cache-manager";
import { DebugManagerDef, DEFAULT_TYPE_ID_KEY, PlainObjectMap } from "@graphql-box/core";
import {
  getRequestContext,
  getRequestData,
  parsedRequests,
  requestFieldTypeMaps,
  responses,
} from "@graphql-box/test-utils";
import { DebugManager } from ".";

const { performance } = window;

describe("@graphql-box/debug-manager >>", () => {
  const realDateNow = Date.now.bind(global.Date);
  let debugManager: DebugManagerDef;

  beforeAll(() => {
    global.Date.now = jest.fn().mockReturnValue(Date.parse("June 6, 1979 GMT"));
  });

  afterAll(() => {
    global.Date.now = realDateNow;
  });

  describe("CacheManager >> CACHE_ENTRY_ADDED >>", () => {
    const response: PlainObjectMap[] = [];

    beforeAll(async () => {
      debugManager = await DebugManager.init({ name: "CLIENT", performance });

      // @ts-ignore
      jest.spyOn(debugManager._performance, "now").mockReturnValue(0);

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

  describe("CacheManager >> CACHE_ENTRY_QUERIED >>", () => {
    const response: PlainObjectMap[] = [];

    beforeAll(async () => {
      debugManager = await DebugManager.init({ name: "CLIENT", performance });

      // @ts-ignore
      jest.spyOn(debugManager._performance, "now").mockReturnValue(0);

      debugManager.on(CACHE_ENTRY_QUERIED, (payload: PlainObjectMap) => {
        response.push(payload);
      });

      // @ts-ignore
      jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

      const cacheManager = await CacheManager.init({
        cache: await Cachemap.init({
          name: "cachemap",
          store: map(),
        }),
        cascadeCacheControl: true,
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

      await cacheManager.analyzeQuery(
        getRequestData(parsedRequests.singleTypeQuery),
        { awaitDataCaching: true },
        getRequestContext({ debugManager, fieldTypeMap: requestFieldTypeMaps.singleTypeQuery }),
      );
    });

    it("correct data emitted", () => {
      expect(response).toMatchSnapshot();
    });
  });
});
