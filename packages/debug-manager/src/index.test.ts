import Cachemap from "@cachemap/core";
import map from "@cachemap/map";
import CacheManager from "@graphql-box/cache-manager";
import {
  CACHE_ENTRY_ADDED,
  CACHE_ENTRY_QUERIED,
  DEFAULT_TYPE_ID_KEY,
  DebugManagerDef,
  PlainObjectMap,
} from "@graphql-box/core";
import {
  getRequestContext,
  getRequestData,
  parsedRequests,
  requestFieldTypeMaps,
  responses,
} from "@graphql-box/test-utils";
import DebugManager from ".";

const { performance } = window;

describe("@graphql-box/debug-manager >>", () => {
  const realDateNow = Date.now.bind(global.Date);
  let debugManager: DebugManagerDef;

  beforeAll(() => {
    global.Date.now = jest.fn().mockReturnValue(Date.parse("June 6, 1979 GMT"));
    // @ts-ignore
    jest.spyOn(global.navigator, "userAgent", "get").mockReturnValue("mock-userAgent");
  });

  afterAll(() => {
    global.Date.now = realDateNow;
  });

  describe("CacheManager >> CACHE_ENTRY_ADDED >>", () => {
    const response: PlainObjectMap[] = [];

    beforeAll(async () => {
      debugManager = new DebugManager({ name: "CLIENT", performance });

      // @ts-ignore
      jest.spyOn(debugManager._performance, "now").mockReturnValue(0);

      debugManager.on("LOG", (message: string, payload: PlainObjectMap) => {
        if (message === CACHE_ENTRY_ADDED) {
          response.push({ message, ...payload });
        }
      });

      const cacheManager = new CacheManager({
        cache: new Cachemap({
          name: "cachemap",
          store: map(),
          type: "someType",
        }),
        cascadeCacheControl: true,
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const requestData = getRequestData(parsedRequests.singleTypeQuery);

      await cacheManager.cacheQuery(
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
      debugManager = new DebugManager({ name: "CLIENT", performance });

      // @ts-ignore
      jest.spyOn(debugManager._performance, "now").mockReturnValue(0);

      debugManager.on("LOG", (message: string, payload: PlainObjectMap) => {
        if (message === CACHE_ENTRY_QUERIED) {
          response.push({ message, ...payload });
        }
      });

      // @ts-ignore
      jest.spyOn(CacheManager, "_isValid").mockReturnValue(true);

      const cacheManager = new CacheManager({
        cache: new Cachemap({
          name: "cachemap",
          store: map(),
          type: "someType",
        }),
        cascadeCacheControl: true,
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const requestData = getRequestData(parsedRequests.singleTypeQuerySet.initial);

      await cacheManager.cacheQuery(
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
