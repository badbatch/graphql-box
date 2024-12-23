import { init as indexedDB } from '@cachemap/indexed-db';
import { makeExecutableSchema } from '@graphql-tools/schema';
import fetchMock from 'fetch-mock';
import { type IntrospectionQuery } from 'graphql';
import { forAwaitEach, isAsyncIterable } from 'iterall';
import { type ExportCacheResult } from '@graphql-box/cache-manager';
import { type Client } from '@graphql-box/client';
import {
  type PartialDehydratedRequestResult,
  type PartialRequestResult,
  type RawResponseDataWithMaybeCacheMetadata,
} from '@graphql-box/core';
import { dehydrateCacheMetadata, hashRequest } from '@graphql-box/helpers';
import { githubIntrospection, parsedRequests, resolvers, responses, typeDefs } from '@graphql-box/test-utils';
import { WebsocketManager } from '@graphql-box/websocket-manager';
import { WS_URL } from '../../constants.ts';
import { expected } from '../../expected/index.ts';
import { initClient } from '../../helpers/initClient.ts';
import { onWebsocketOpen } from '../../helpers/onWebsocketOpen.ts';
import { mockRequest } from '../../modules/fetch-mock/index.ts';

const introspection = githubIntrospection as IntrospectionQuery;
const defaultOptions = { awaitDataCaching: true, returnCacheMetadata: true };

const typeCacheDirectives = {
  Organization: 'public, max-age=1',
  Repository: 'public, max-age=3',
  RepositoryConnection: 'public, max-age=1',
  RepositoryOwner: 'public, max-age=3',
};

describe('client', () => {
  const realDateNow = Date.now.bind(globalThis.Date);

  beforeAll(() => {
    globalThis.Date.now = () => Date.parse('June 6, 1979 GMT');
  });

  afterAll(() => {
    globalThis.Date.now = realDateNow;
  });

  describe('request', () => {
    let cache: ExportCacheResult;
    let client: Client;
    let response: Omit<PartialDehydratedRequestResult, 'requestID'>;

    describe('no match', () => {
      beforeAll(async () => {
        mockRequest(fetchMock, { data: responses.singleTypeQuery.data });

        client = initClient({
          cachemapStore: indexedDB(),
          introspection,
          typeCacheDirectives,
        });

        const request = parsedRequests.singleTypeQuery;
        const { _cacheMetadata, data } = (await client.query(request, { ...defaultOptions })) as PartialRequestResult;
        response = { data };

        if (_cacheMetadata) {
          response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        }

        cache = await client.cache.export();
      });

      afterAll(async () => {
        fetchMock.restore();
        await client.cache.clear();
      });

      it('correct response data', () => {
        expect(response).toEqual(expected.noMatch.response);
      });

      it('correct cache data', () => {
        expect(cache).toEqual(expected.noMatch.cache);
      });
    });

    describe('query tracker exact match', () => {
      beforeAll(async () => {
        mockRequest(fetchMock, { data: responses.singleTypeQuery.data });

        client = initClient({
          cachemapStore: indexedDB(),
          introspection,
          typeCacheDirectives,
        });

        const request = parsedRequests.singleTypeQuery;

        const result = await Promise.all([
          client.query(request, { ...defaultOptions }),
          client.query(request, { ...defaultOptions }),
        ]);

        const { _cacheMetadata, data } = result[1] as PartialRequestResult;
        response = { data };

        if (_cacheMetadata) {
          response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        }

        cache = await client.cache.export();
      });

      afterAll(async () => {
        fetchMock.restore();
        await client.cache.clear();
      });

      it('one request', () => {
        expect(fetchMock.calls()).toHaveSize(1);
      });

      it('correct response data', () => {
        expect(response).toEqual(expected.queryTrackerExactMatch.response);
      });

      it('correct cache data', () => {
        expect(cache).toEqual(expected.queryTrackerExactMatch.cache);
      });
    });

    describe('query tracker partial match', () => {
      beforeAll(async () => {
        mockRequest(fetchMock, { data: responses.nestedTypeQuery.data });

        client = initClient({
          cachemapStore: indexedDB(),
          introspection,
          typeCacheDirectives,
        });

        const result = await Promise.all([
          client.query(parsedRequests.nestedTypeQuery, { ...defaultOptions }),
          client.query(parsedRequests.singleTypeQuery, { ...defaultOptions }),
        ]);

        const { _cacheMetadata, data } = result[1] as PartialRequestResult;
        response = { data };

        if (_cacheMetadata) {
          response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        }

        cache = await client.cache.export();
      });

      afterAll(async () => {
        fetchMock.restore();
        await client.cache.clear();
      });

      it('one request', () => {
        expect(fetchMock.calls()).toHaveSize(1);
      });

      it('correct response data', () => {
        expect(response).toEqual(expected.queryTrackerPartialMatch.response);
      });

      it('correct cache data', () => {
        expect(cache).toEqual(expected.queryTrackerPartialMatch.cache);
      });
    });

    describe('query response match', () => {
      beforeAll(async () => {
        mockRequest(fetchMock, { data: responses.singleTypeQuery.data });

        client = initClient({
          cachemapStore: indexedDB(),
          introspection,
          typeCacheDirectives,
        });

        const request = parsedRequests.singleTypeQuery;
        await client.query(request, { ...defaultOptions });
        fetchMock.resetHistory();

        const { _cacheMetadata, data } = (await client.query(request, { ...defaultOptions })) as PartialRequestResult;
        response = { data };

        if (_cacheMetadata) {
          response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        }

        cache = await client.cache.export();
      });

      afterAll(async () => {
        fetchMock.restore();
        await client.cache.clear();
      });

      it('no request', () => {
        expect(fetchMock.calls()).toHaveSize(0);
      });

      it('correct response data', () => {
        expect(response).toEqual(expected.queryResponseMatch.response);
      });

      it('correct cache data', () => {
        expect(cache).toEqual(expected.queryResponseMatch.cache);
      });
    });

    describe('request field path / data entity match', () => {
      beforeAll(async () => {
        mockRequest(fetchMock, { data: responses.singleTypeQuery.data });

        client = initClient({
          cachemapStore: indexedDB(),
          introspection,
          typeCacheDirectives,
        });

        const { full, initial } = parsedRequests.singleTypeQuerySet;
        await client.query(full, { ...defaultOptions });
        fetchMock.resetHistory();

        const { _cacheMetadata, data } = (await client.query(initial, { ...defaultOptions })) as PartialRequestResult;
        response = { data };

        if (_cacheMetadata) {
          response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        }

        cache = await client.cache.export();
      });

      afterAll(async () => {
        fetchMock.restore();
        await client.cache.clear();
      });

      it('no request', () => {
        expect(fetchMock.calls()).toHaveSize(0);
      });

      it('correct response data', () => {
        expect(response).toEqual(expected.requestFieldPathDataEntityMatch.response);
      });

      it('correct cache data', () => {
        expect(cache).toEqual(expected.requestFieldPathDataEntityMatch.cache);
      });
    });

    describe('request field path / data entity partial match', () => {
      beforeAll(async () => {
        const { full, initial, updated } = parsedRequests.nestedTypeQuerySet;

        mockRequest(fetchMock, {
          data: responses.nestedTypeQuerySet.initial.data,
          hash: hashRequest(initial),
        });

        mockRequest(fetchMock, {
          data: (responses.nestedTypeQuerySet.updated as RawResponseDataWithMaybeCacheMetadata).data,
          hash: hashRequest(updated),
        });

        client = initClient({
          cachemapStore: indexedDB(),
          introspection,
          typeCacheDirectives,
        });

        await client.query(initial, { ...defaultOptions });
        fetchMock.resetHistory();

        const { _cacheMetadata, data } = (await client.query(full, { ...defaultOptions })) as PartialRequestResult;
        response = { data };

        if (_cacheMetadata) {
          response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        }

        cache = await client.cache.export();
      });

      afterAll(async () => {
        fetchMock.restore();
        await client.cache.clear();
      });

      it('one request', () => {
        expect(fetchMock.calls()).toHaveSize(1);
      });

      it('correct response data', () => {
        expect(response).toEqual(expected.requestFieldPathDataEntityPartialMatch.response);
      });

      it('correct cache data', () => {
        expect(cache).toEqual(expected.requestFieldPathDataEntityPartialMatch.cache);
      });
    });
  });

  describe('subscribe', () => {
    let asyncIterator: AsyncIterator<PartialRequestResult | undefined>;
    let cache: ExportCacheResult;
    let client: Client;
    let mutResponse: Omit<PartialDehydratedRequestResult, 'requestID'>;
    let subResponse: Omit<PartialDehydratedRequestResult, 'requestID'>;
    let subscriptionResponse: Promise<void>;

    beforeAll(async () => {
      const websocket = new WebSocket(WS_URL);
      await onWebsocketOpen(websocket);

      client = initClient({
        cachemapStore: indexedDB(),
        schema: makeExecutableSchema({
          resolvers,
          typeDefs,
          updateResolversInPlace: true,
        }),
        subscriptionsManager: new WebsocketManager({ websocket }),
        typeCacheDirectives: {
          Email: 'public, max-age=5',
          Inbox: 'public, max-age=1',
        },
      });

      asyncIterator = (await client.subscribe(parsedRequests.nestedTypeSubscription, {
        ...defaultOptions,
      })) as AsyncIterator<PartialRequestResult | undefined>;

      subscriptionResponse = new Promise(resolve => {
        if (isAsyncIterable(asyncIterator)) {
          void forAwaitEach(asyncIterator, async ({ _cacheMetadata, data }: PartialRequestResult) => {
            subResponse = { data };

            if (_cacheMetadata) {
              subResponse._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
            }

            cache = await client.cache.export();
            resolve();
          });
        }
      });
    });

    describe('register subscription', () => {
      it('correct response data', () => {
        expect(isAsyncIterable(asyncIterator)).toBe(true);
      });
    });

    describe('request mutation', () => {
      beforeAll(async () => {
        fetchMock.config.fallbackToNetwork = true;
        fetchMock.config.warnOnFallback = false;

        const { _cacheMetadata, data } = (await client.mutate(parsedRequests.nestedTypeMutation, {
          ...defaultOptions,
        })) as PartialRequestResult;

        mutResponse = { data };

        if (_cacheMetadata) {
          mutResponse._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        }

        await subscriptionResponse;
      });

      afterAll(async () => {
        fetchMock.config.fallbackToNetwork = false;
        fetchMock.config.warnOnFallback = true;
        await client.cache.clear();
      });

      it('correct mutation response data', () => {
        expect(mutResponse).toEqual(expected.requestMutation.mutationResponse);
      });

      it('correct subscription response data', () => {
        expect(subResponse).toEqual(expected.requestMutation.subscriptionResponse);
      });

      it('correct cache data', () => {
        expect(cache).toEqual(expected.requestMutation.cache);
      });
    });
  });
});
