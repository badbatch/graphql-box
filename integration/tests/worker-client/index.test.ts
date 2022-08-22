import { ExportCacheResult } from "@graphql-box/cache-manager";
import { MaybeRequestResult, MaybeRequestResultWithDehydratedCacheMetadata } from "@graphql-box/core";
import { dehydrateCacheMetadata } from "@graphql-box/helpers";
import { parsedRequests } from "@graphql-box/test-utils";
import WorkerClient from "@graphql-box/worker-client";
import { expect, use } from "chai";
import { matchSnapshot } from "chai-karma-snapshot";
import { defaultOptions, log } from "../../helpers";
import initWorkerClient from "../../helpers/init-worker";
import FetchMockWorker from "../../modules/fetch-mock";

use(matchSnapshot);

describe("worker-client", () => {
  describe("request", () => {
    let cache: ExportCacheResult;
    let fetchMockWorker: FetchMockWorker;
    let worker: Worker;
    let workerClient: WorkerClient;
    let response: Omit<MaybeRequestResultWithDehydratedCacheMetadata, "requestID">;

    describe("no match", () => {
      before(async () => {
        try {
          worker = new Worker("worker.js");
          fetchMockWorker = new FetchMockWorker(worker);
          workerClient = initWorkerClient({ worker });
        } catch (errors) {
          log(errors);
        }

        const request = parsedRequests.singleTypeQuery;

        try {
          const { _cacheMetadata, data } = (await workerClient.query(request, {
            ...defaultOptions,
          })) as MaybeRequestResult;

          response = { data };

          if (_cacheMetadata) {
            response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
          }
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

    describe("query tracker exact match", () => {
      before(async () => {
        try {
          worker = new Worker("worker.js");
          fetchMockWorker = new FetchMockWorker(worker);
          workerClient = initWorkerClient({ worker });
        } catch (errors) {
          log(errors);
        }

        const request = parsedRequests.singleTypeQuery;

        try {
          const result = await Promise.all([
            workerClient.query(request, { ...defaultOptions }),
            workerClient.query(request, { ...defaultOptions }),
          ]);

          const { _cacheMetadata, data } = result[1] as MaybeRequestResult;
          response = { data };

          if (_cacheMetadata) {
            response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
          }
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

    describe("query tracker partial match", () => {
      before(async () => {
        try {
          worker = new Worker("worker.js");
          fetchMockWorker = new FetchMockWorker(worker);
          workerClient = initWorkerClient({ worker });
        } catch (errors) {
          log(errors);
        }

        try {
          const result = await Promise.all([
            workerClient.query(parsedRequests.nestedTypeQuery, { ...defaultOptions }),
            workerClient.query(parsedRequests.singleTypeQuery, { ...defaultOptions }),
          ]);

          const { _cacheMetadata, data } = result[1] as MaybeRequestResult;
          response = { data };

          if (_cacheMetadata) {
            response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
          }
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
          workerClient = initWorkerClient({ worker });
        } catch (errors) {
          log(errors);
        }

        const request = parsedRequests.singleTypeQuery;

        try {
          await workerClient.query(request, { ...defaultOptions });
        } catch (errors) {
          log(errors);
        }

        await fetchMockWorker.postMessage("resetHistory");

        try {
          const { _cacheMetadata, data } = (await workerClient.query(request, {
            ...defaultOptions,
          })) as MaybeRequestResult;

          response = { data };

          if (_cacheMetadata) {
            response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
          }
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
          workerClient = initWorkerClient({ worker });
        } catch (errors) {
          log(errors);
        }

        const { full, initial } = parsedRequests.singleTypeQuerySet;

        try {
          await workerClient.query(full, { ...defaultOptions });
        } catch (errors) {
          log(errors);
        }

        await fetchMockWorker.postMessage("resetHistory");

        try {
          const { _cacheMetadata, data } = (await workerClient.query(initial, {
            ...defaultOptions,
          })) as MaybeRequestResult;

          response = { data };

          if (_cacheMetadata) {
            response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
          }
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
          workerClient = initWorkerClient({ worker });
        } catch (errors) {
          log(errors);
        }

        try {
          await workerClient.query(initial, { ...defaultOptions });
        } catch (errors) {
          log(errors);
        }

        await fetchMockWorker.postMessage("resetHistory");

        try {
          const { _cacheMetadata, data } = (await workerClient.query(full, {
            ...defaultOptions,
          })) as MaybeRequestResult;

          response = { data };

          if (_cacheMetadata) {
            response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
          }
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
