import Core from "@cachemap/core";
import map from "@cachemap/map";
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
      typeIDKey: DEFAULT_TYPE_ID_KEY,
    });
  });

  describe("the analyzeQuery method", () => {
    describe("when there are no matching entries in the cache manager", () => {
      beforeAll(async () => {
        // TODO
      });

      it("then the method should return the original request", () => {
        // TODO
      });
    });
  });
});
