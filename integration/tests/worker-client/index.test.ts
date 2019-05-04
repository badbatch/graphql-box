import { ExportCacheResult } from "@handl/cache-manager";
import { MaybeRequestResultWithDehydratedCacheMetadata } from "@handl/core";
import { dehydrateCacheMetadata } from "@handl/helpers";
import { parsedRequests } from "@handl/test-utils";
import WorkerClient from "@handl/worker-client";
import { expect, use } from "chai";
import { matchSnapshot } from "chai-karma-snapshot";
import { defaultOptions, initWorkerClient, log } from "../../helpers";

use(matchSnapshot);

describe("worker-client", () => {
  describe("request", () => {
    let cache: ExportCacheResult;
    let worker: Worker;
    let workerClient: WorkerClient;
    let response: MaybeRequestResultWithDehydratedCacheMetadata;

    describe("no match", () => {
      before(async () => {
        try {
          worker = new Worker("worker.js");
          workerClient = await initWorkerClient({ worker });
        } catch (errors) {
          log(errors);
        }

        const request = parsedRequests.singleTypeQuery;

        try {
          const { _cacheMetadata, data } = await workerClient.request(request, { ...defaultOptions });
          response = { _cacheMetadata: dehydrateCacheMetadata(_cacheMetadata), data };
        } catch (errors) {
          log(errors);
        }

        cache = await workerClient.cache.export();
      });

      after(async () => {
        await workerClient.cache.clear();
      });

      it("correct response data", () => {
        expect(response).to.matchSnapshot();
      });

      it("correct cache data", () => {
        expect(cache).to.matchSnapshot();
      });
    });
  });
});
