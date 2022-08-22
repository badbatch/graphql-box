import Core from "@cachemap/core";
import indexedDB from "@cachemap/indexed-db";
import { ExportCacheResult } from "@graphql-box/cache-manager";
import Client from "@graphql-box/client";
import {
  MaybeRequestResult,
  MaybeRequestResultWithDehydratedCacheMetadata,
  RawResponseDataWithMaybeCacheMetadata,
} from "@graphql-box/core";
import { dehydrateCacheMetadata, hashRequest } from "@graphql-box/helpers";
import {
  githubIntrospection as introspection,
  parsedRequests,
  responses,
  schemaResolvers,
  schemaTypeDefs,
} from "@graphql-box/test-utils";
import websocketManager from "@graphql-box/websocket-manager";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { expect, use } from "chai";
import { matchSnapshot } from "chai-karma-snapshot";
import fetchMock from "fetch-mock";
import { forAwaitEach, isAsyncIterable } from "iterall";
import sinon from "sinon";
import { WS_URL } from "../../consts";
import { defaultOptions, log, onWebsocketOpen } from "../../helpers";
import initClient from "../../helpers/init-client";
import { mockRequest } from "../../modules/fetch-mock";

use(matchSnapshot);

describe("client", () => {
  const realDateNow = Date.now.bind(global.Date);

  before(() => {
    global.Date.now = sinon.stub().returns(Date.parse("June 6, 1979 GMT"));
  });

  after(() => {
    global.Date.now = realDateNow;
  });

  describe("request", () => {
    let cache: ExportCacheResult;
    let client: Client;
    let response: Omit<MaybeRequestResultWithDehydratedCacheMetadata, "requestID">;

    describe("no match", () => {
      before(async () => {
        mockRequest(fetchMock, { data: responses.singleTypeQuery.data });

        const typeCacheDirectives = {
          Organization: "public, max-age=1",
        };

        try {
          client = initClient({
            cachemapStore: indexedDB(),
            introspection,
            typeCacheDirectives,
          });
        } catch (errors) {
          log(errors);
        }

        const request = parsedRequests.singleTypeQuery;

        try {
          const { _cacheMetadata, data } = (await client.query(request, { ...defaultOptions })) as MaybeRequestResult;
          response = { data };

          if (_cacheMetadata) {
            response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
          }
        } catch (errors) {
          log(errors);
        }

        cache = await (client.cache as Core).export();
      });

      after(async () => {
        fetchMock.restore();
        await (client.cache as Core).clear();
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
        mockRequest(fetchMock, { data: responses.singleTypeQuery.data });

        const typeCacheDirectives = {
          Organization: "public, max-age=1",
        };

        try {
          client = initClient({
            cachemapStore: indexedDB(),
            introspection,
            typeCacheDirectives,
          });
        } catch (errors) {
          log(errors);
        }

        const request = parsedRequests.singleTypeQuery;

        try {
          const result = await Promise.all([
            client.query(request, { ...defaultOptions }),
            client.query(request, { ...defaultOptions }),
          ]);

          const { _cacheMetadata, data } = result[1] as MaybeRequestResult;
          response = { data };
          if (_cacheMetadata) response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        } catch (errors) {
          log(errors);
        }

        cache = await (client.cache as Core).export();
      });

      after(async () => {
        fetchMock.restore();
        await (client.cache as Core).clear();
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

    describe("query tracker partial match", () => {
      before(async () => {
        mockRequest(fetchMock, { data: responses.nestedTypeQuery.data });

        const typeCacheDirectives = {
          Organization: "public, max-age=1",
        };

        try {
          client = initClient({
            cachemapStore: indexedDB(),
            introspection,
            typeCacheDirectives,
          });
        } catch (errors) {
          log(errors);
        }

        try {
          const result = await Promise.all([
            client.query(parsedRequests.nestedTypeQuery, { ...defaultOptions }),
            client.query(parsedRequests.singleTypeQuery, { ...defaultOptions }),
          ]);

          const { _cacheMetadata, data } = result[1] as MaybeRequestResult;
          response = { data };

          if (_cacheMetadata) {
            response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
          }
        } catch (errors) {
          log(errors);
        }

        cache = await (client.cache as Core).export();
      });

      after(async () => {
        fetchMock.restore();
        await (client.cache as Core).clear();
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
        mockRequest(fetchMock, { data: responses.singleTypeQuery.data });

        const typeCacheDirectives = {
          Organization: "public, max-age=1",
        };

        try {
          client = initClient({
            cachemapStore: indexedDB(),
            introspection,
            typeCacheDirectives,
          });
        } catch (errors) {
          log(errors);
        }

        const request = parsedRequests.singleTypeQuery;

        try {
          await client.query(request, { ...defaultOptions });
        } catch (errors) {
          log(errors);
        }

        fetchMock.resetHistory();

        try {
          const { _cacheMetadata, data } = (await client.query(request, { ...defaultOptions })) as MaybeRequestResult;
          response = { data };
          if (_cacheMetadata) response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        } catch (errors) {
          log(errors);
        }

        cache = await (client.cache as Core).export();
      });

      after(async () => {
        fetchMock.restore();
        await (client.cache as Core).clear();
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
        mockRequest(fetchMock, { data: responses.singleTypeQuery.data });

        const typeCacheDirectives = {
          Organization: "public, max-age=1",
        };

        try {
          client = initClient({
            cachemapStore: indexedDB(),
            introspection,
            typeCacheDirectives,
          });
        } catch (errors) {
          log(errors);
        }

        const { full, initial } = parsedRequests.singleTypeQuerySet;

        try {
          await client.query(full, { ...defaultOptions });
        } catch (errors) {
          log(errors);
        }

        fetchMock.resetHistory();

        try {
          const { _cacheMetadata, data } = (await client.query(initial, { ...defaultOptions })) as MaybeRequestResult;
          response = { data };
          if (_cacheMetadata) response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        } catch (errors) {
          log(errors);
        }

        cache = await ((client.cache as Core) as Core).export();
      });

      after(async () => {
        fetchMock.restore();
        await (client.cache as Core).clear();
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

        mockRequest(fetchMock, {
          data: responses.nestedTypeQuerySet.initial.data,
          hash: hashRequest(initial),
        });

        mockRequest(fetchMock, {
          data: (responses.nestedTypeQuerySet.updated as RawResponseDataWithMaybeCacheMetadata).data,
          hash: hashRequest(updated),
        });

        const typeCacheDirectives = {
          Organization: "public, max-age=3",
          Repository: "public, max-age=3",
          RepositoryConnection: "public, max-age=1",
          RepositoryOwner: "public, max-age=3",
        };

        try {
          client = initClient({
            cachemapStore: indexedDB(),
            introspection,
            typeCacheDirectives,
          });
        } catch (errors) {
          log(errors);
        }

        try {
          await client.query(initial, { ...defaultOptions });
        } catch (errors) {
          log(errors);
        }

        fetchMock.resetHistory();

        try {
          const { _cacheMetadata, data } = (await client.query(full, { ...defaultOptions })) as MaybeRequestResult;
          response = { data };

          if (_cacheMetadata) {
            response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
          }
        } catch (errors) {
          log(errors);
        }

        cache = await (client.cache as Core).export();
      });

      after(async () => {
        fetchMock.restore();
        await (client.cache as Core).clear();
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

  describe("subscribe", () => {
    let asyncIterator: AsyncIterator<MaybeRequestResult | undefined>;
    let cache: ExportCacheResult;
    let client: Client;
    let mutResponse: Omit<MaybeRequestResultWithDehydratedCacheMetadata, "requestID">;
    let subResponse: Omit<MaybeRequestResultWithDehydratedCacheMetadata, "requestID">;
    let subscriptionResponse: Promise<void>;

    before(async () => {
      try {
        const websocket = new WebSocket(WS_URL);
        await onWebsocketOpen(websocket);

        client = initClient({
          cachemapStore: indexedDB(),
          schema: makeExecutableSchema({
            parseOptions: { enableDeferStream: true },
            resolvers: schemaResolvers,
            typeDefs: schemaTypeDefs,
            updateResolversInPlace: true,
          }),
          subscriptionsManager: websocketManager({ websocket }),
          typeCacheDirectives: {
            Email: "public, max-age=5",
            Inbox: "public, max-age=1",
          },
        });
      } catch (errors) {
        log(errors);
      }

      try {
        asyncIterator = (await client.subscribe(parsedRequests.nestedTypeSubscription, {
          ...defaultOptions,
        })) as AsyncIterator<MaybeRequestResult | undefined>;

        subscriptionResponse = new Promise(resolve => {
          if (isAsyncIterable(asyncIterator)) {
            forAwaitEach(asyncIterator, async ({ _cacheMetadata, data }: MaybeRequestResult) => {
              subResponse = { data };
              if (_cacheMetadata) subResponse._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
              cache = await (client.cache as Core).export();
              resolve();
            });
          }
        });
      } catch (errors) {
        log(errors);
      }
    });

    after(async () => {
      await (client.cache as Core).clear();
    });

    describe("register subscription", () => {
      it("correct response data", () => {
        expect(isAsyncIterable(asyncIterator)).to.equal(true);
      });
    });

    describe("request mutation", () => {
      before(async () => {
        fetchMock.config.fallbackToNetwork = true;
        fetchMock.config.warnOnFallback = false;

        try {
          const { _cacheMetadata, data } = (await client.mutate(parsedRequests.nestedTypeMutation, {
            ...defaultOptions,
          })) as MaybeRequestResult;

          mutResponse = { data };
          if (_cacheMetadata) mutResponse._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
          await subscriptionResponse;
        } catch (errors) {
          log(errors);
        }
      });

      after(() => {
        fetchMock.config.fallbackToNetwork = false;
        fetchMock.config.warnOnFallback = true;
      });

      it("correct mutation response data", () => {
        expect(mutResponse).to.matchSnapshot();
      });

      it("correct subscription response data", () => {
        expect(subResponse).to.matchSnapshot();
      });

      it("correct cache data", () => {
        expect(cache).to.matchSnapshot();
      });
    });
  });
});
