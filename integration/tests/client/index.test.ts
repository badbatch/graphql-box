import indexedDB from "@cachemap/indexed-db";
import { ExportCacheResult } from "@handl/cache-manager";
import Client from "@handl/client";
import { MaybeRequestResultWithDehydratedCacheMetadata } from "@handl/core";
import { dehydrateCacheMetadata, hashRequest } from "@handl/helpers";
import { parsedRequests, responses } from "@handl/test-utils";
import { expect, use } from "chai";
import { matchSnapshot } from "chai-karma-snapshot";
import fetchMock from "fetch-mock";
import sinon from "sinon";
import {
  defaultOptions,
  initClient,
  log,
  mockRequest,
} from "../../helpers";

use(matchSnapshot);

describe("client", () => {
  const realDateNow = Date.now.bind(global.Date);

  before(() => {
    global.Date.now = sinon.stub().returns(Date.parse("June 6, 1979"));
  });

  after(() => {
    global.Date.now = realDateNow;
  });

  describe("request", () => {
    let cache: ExportCacheResult;
    let client: Client;
    let response: MaybeRequestResultWithDehydratedCacheMetadata;

    describe("no match", () => {
      before(async () => {
        mockRequest({ data: responses.singleTypeQuery.data });

        const typeCacheDirectives = {
          Organization: "public, max-age=1",
        };

        try {
          client = await initClient({ cachemapStore: indexedDB(), typeCacheDirectives });
        } catch (errors) {
          log(errors);
        }

        const request = parsedRequests.singleTypeQuery;

        try {
          const { _cacheMetadata, data } = await client.request(request, { ...defaultOptions });
          response = { _cacheMetadata: dehydrateCacheMetadata(_cacheMetadata), data };
        } catch (errors) {
          log(errors);
        }

        cache = await client.cache.export();
      });

      after(async () => {
        fetchMock.restore();
        await client.cache.clear();
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
        mockRequest({ data: responses.singleTypeQuery.data });

        const typeCacheDirectives = {
          Organization: "public, max-age=1",
        };

        try {
          client = await initClient({ cachemapStore: indexedDB(), typeCacheDirectives });
        } catch (errors) {
          log(errors);
        }

        const request = parsedRequests.singleTypeQuery;

        try {
          const result = await Promise.all([
            client.request(request, { ...defaultOptions }),
            client.request(request, { ...defaultOptions }),
          ]);

          const { _cacheMetadata, data } = result[1];
          response = { _cacheMetadata: dehydrateCacheMetadata(_cacheMetadata), data };
        } catch (errors) {
          log(errors);
        }

        cache = await client.cache.export();
      });

      after(async () => {
        fetchMock.restore();
        await client.cache.clear();
      });

      it("one request", () => {
        expect(fetchMock.calls()).to.have.lengthOf(1);
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
        mockRequest({ data: responses.singleTypeQuery.data });

        const typeCacheDirectives = {
          Organization: "public, max-age=1",
        };

        try {
          client = await initClient({ cachemapStore: indexedDB(), typeCacheDirectives });
        } catch (errors) {
          log(errors);
        }

        const request = parsedRequests.singleTypeQuery;

        try {
          await client.request(request, { ...defaultOptions });
        } catch (errors) {
          log(errors);
        }

        fetchMock.resetHistory();

        try {
          const { _cacheMetadata, data } = await client.request(request, { ...defaultOptions });
          response = { _cacheMetadata: dehydrateCacheMetadata(_cacheMetadata), data };
        } catch (errors) {
          log(errors);
        }

        cache = await client.cache.export();
      });

      after(async () => {
        fetchMock.restore();
        await client.cache.clear();
      });

      it("no request", () => {
        expect(fetchMock.calls()).to.have.lengthOf(0);
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
        mockRequest({ data: responses.singleTypeQuery.data });

        const typeCacheDirectives = {
          Organization: "public, max-age=1",
        };

        try {
          client = await initClient({ cachemapStore: indexedDB(), typeCacheDirectives });
        } catch (errors) {
          log(errors);
        }

        const { full, initial } = parsedRequests.singleTypeQuerySet;

        try {
          await client.request(full, { ...defaultOptions });
        } catch (errors) {
          log(errors);
        }

        fetchMock.resetHistory();

        try {
          const { _cacheMetadata, data } = await client.request(initial, { ...defaultOptions });
          response = { _cacheMetadata: dehydrateCacheMetadata(_cacheMetadata), data };
        } catch (errors) {
          log(errors);
        }

        cache = await client.cache.export();
      });

      after(async () => {
        fetchMock.restore();
        await client.cache.clear();
      });

      it("no request", () => {
        expect(fetchMock.calls()).to.have.lengthOf(0);
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
        const { full, initial, updated } = parsedRequests.nestedTypeQuerySet;

        mockRequest({
          data: responses.nestedTypeQuerySet.initial.data,
          hash: hashRequest(initial),
        });

        mockRequest({
          data: responses.nestedTypeQuerySet.updated.data,
          hash: hashRequest(updated),
        });

        const typeCacheDirectives = {
          Organization: "public, max-age=3",
          Repository: "public, max-age=3",
          RepositoryConnection: "public, max-age=1",
          RepositoryOwner: "public, max-age=3",
        };

        try {
          client = await initClient({ cachemapStore: indexedDB(), typeCacheDirectives });
        } catch (errors) {
          log(errors);
        }

        try {
          await client.request(initial, { ...defaultOptions });
        } catch (errors) {
          log(errors);
        }

        fetchMock.resetHistory();

        try {
          const { _cacheMetadata, data } = await client.request(full, { ...defaultOptions });
          response = { _cacheMetadata: dehydrateCacheMetadata(_cacheMetadata), data };
        } catch (errors) {
          log(errors);
        }

        cache = await client.cache.export();
      });

      after(async () => {
        fetchMock.restore();
        await client.cache.clear();
      });

      it("one request", () => {
        expect(fetchMock.calls()).to.have.lengthOf(1);
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
