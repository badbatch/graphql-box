import { ExportCacheResult } from "@handl/cache-manager";
import { MaybeRequestResultWithDehydratedCacheMetadata } from "@handl/core";
import { dehydrateCacheMetadata } from "@handl/helpers";
import { parsedRequests } from "@handl/test-utils";
import WorkerClient from "@handl/worker-client";
import { expect, use } from "chai";
import { matchSnapshot } from "chai-karma-snapshot";
import FetchMockWorker from "../../fetch-mock";
import { defaultOptions, initWorkerClient, log } from "../../helpers";

use(matchSnapshot);

describe("worker-client", () => {
  describe("request", () => {
    let cache: ExportCacheResult;
    let fetchMockWorker: FetchMockWorker;
    let worker: Worker;
    let workerClient: WorkerClient;
    let response: MaybeRequestResultWithDehydratedCacheMetadata;

    describe("no match", () => {
      before(async () => {
        try {
          worker = new Worker("worker.js");
          fetchMockWorker = new FetchMockWorker(worker);
          workerClient = await initWorkerClient({ worker });
        } catch (errors) {
          log(errors);
        }

        const request = parsedRequests.singleTypeQuery;

        try {
          const { _cacheMetadata, data } = await workerClient.request(request, { ...defaultOptions });
          response = { data };
          if (_cacheMetadata) response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        } catch (errors) {
          log(errors);
        }

        cache = await workerClient.cache.export();
      });

      after(async () => {
        await fetchMockWorker.postMessage("resetHistory");
        await workerClient.cache.clear();
      });

      it("correct response data", () => {
        expect(response).to.matchSnapshot();
      });

      it("correct cache data", () => {
        expect(cache).to.matchSnapshot();
      });
    });

    describe("query tracker match", () => {
      before(async () => {
        try {
          worker = new Worker("worker.js");
          fetchMockWorker = new FetchMockWorker(worker);
          workerClient = await initWorkerClient({ worker });
        } catch (errors) {
          log(errors);
        }

        const request = parsedRequests.singleTypeQuery;

        try {
          const result = await Promise.all([
            workerClient.request(request, { ...defaultOptions }),
            workerClient.request(request, { ...defaultOptions }),
          ]);

          const { _cacheMetadata, data } = result[1];
          response = { data };
          if (_cacheMetadata) response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        } catch (errors) {
          log(errors);
        }

        cache = await workerClient.cache.export();
      });

      after(async () => {
        await fetchMockWorker.postMessage("resetHistory");
        await workerClient.cache.clear();
      });

      it("one request", async () => {
        const calls = await fetchMockWorker.postMessage("calls", { returnValue: true });
        expect(calls).to.have.lengthOf(1);
      });

      it("correct response data", () => {
        expect(response).to.matchSnapshot();
      });

      it("correct cache data", () => {
        expect(cache).to.matchSnapshot();
      });
    });

    describe("query response match", () => {
      before(async () => {
        try {
          worker = new Worker("worker.js");
          fetchMockWorker = new FetchMockWorker(worker);
          workerClient = await initWorkerClient({ worker });
        } catch (errors) {
          log(errors);
        }

        const request = parsedRequests.singleTypeQuery;

        try {
          await workerClient.request(request, { ...defaultOptions });
        } catch (errors) {
          log(errors);
        }

        await fetchMockWorker.postMessage("resetHistory");

        try {
          const { _cacheMetadata, data } = await workerClient.request(request, { ...defaultOptions });
          response = { data };
          if (_cacheMetadata) response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        } catch (errors) {
          log(errors);
        }

        cache = await workerClient.cache.export();
      });

      after(async () => {
        await fetchMockWorker.postMessage("resetHistory");
        await workerClient.cache.clear();
      });

      it("no request", async () => {
        const calls = await fetchMockWorker.postMessage("calls", { returnValue: true });
        expect(calls).to.have.lengthOf(0);
      });

      it("correct response data", () => {
        expect(response).to.matchSnapshot();
      });

      it("correct cache data", () => {
        expect(cache).to.matchSnapshot();
      });
    });

    describe("request field path / data entity match", () => {
      before(async () => {
        try {
          worker = new Worker("worker.js");
          fetchMockWorker = new FetchMockWorker(worker);
          workerClient = await initWorkerClient({ worker });
        } catch (errors) {
          log(errors);
        }

        const { full, initial } = parsedRequests.singleTypeQuerySet;

        try {
          await workerClient.request(full, { ...defaultOptions });
        } catch (errors) {
          log(errors);
        }

        await fetchMockWorker.postMessage("resetHistory");

        try {
          const { _cacheMetadata, data } = await workerClient.request(initial, { ...defaultOptions });
          response = { data };
          if (_cacheMetadata) response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        } catch (errors) {
          log(errors);
        }

        cache = await workerClient.cache.export();
      });

      after(async () => {
        await fetchMockWorker.postMessage("resetHistory");
        await workerClient.cache.clear();
      });

      it("no request", async () => {
        const calls = await fetchMockWorker.postMessage("calls", { returnValue: true });
        expect(calls).to.have.lengthOf(0);
      });

      it("correct response data", () => {
        expect(response).to.matchSnapshot();
      });

      it("correct cache data", () => {
        expect(cache).to.matchSnapshot();
      });
    });

    describe("request field path / data entity partial match", () => {
      before(async () => {
        const { full, initial } = parsedRequests.nestedTypeQuerySet;

        try {
          worker = new Worker("worker.js");
          fetchMockWorker = new FetchMockWorker(worker);
          workerClient = await initWorkerClient({ worker });
        } catch (errors) {
          log(errors);
        }

        try {
          await workerClient.request(initial, { ...defaultOptions });
        } catch (errors) {
          log(errors);
        }

        await fetchMockWorker.postMessage("resetHistory");

        try {
          const { _cacheMetadata, data } = await workerClient.request(full, { ...defaultOptions });
          response = { data };
          if (_cacheMetadata) response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        } catch (errors) {
          log(errors);
        }

        cache = await workerClient.cache.export();
      });

      after(async () => {
        await fetchMockWorker.postMessage("resetHistory");
        await workerClient.cache.clear();
      });

      it("one request", async () => {
        const calls = await fetchMockWorker.postMessage("calls", { returnValue: true });
        expect(calls).to.have.lengthOf(1);
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
