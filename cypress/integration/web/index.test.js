import Cachemap from '@cachemap/core';
import indexedDB from '@cachemap/indexed-db';
import cacheManager from '@handl/cache-manager';
import Client from '@handl/client';
import { DEFAULT_TYPE_ID_KEY } from '@handl/core';
import debugManager from '@handl/debug-manager';
import fetchManager from '@handl/fetch-manager';
import { dehydrateCacheMetadata, hashRequest } from '@handl/helpers';
import requestParser from '@handl/request-parser';
import { githubIntrospection, parsedRequests, responses } from '@handl/test-utils';
import fetchMock from 'fetch-mock';

const defaultOptions = { awaitDataCaching: true, returnCacheMetadata: true };
const { performance } = window;
const url = 'https://api.github.com/graphql';

function log(...args) {
  console.log(...args); // eslint-disable-line no-console
}

async function initClient({ typeCacheDirectives }) {
  return Client.init({
    cacheManager: cacheManager({
      cache: await Cachemap.init({
        name: 'cachemap',
        store: indexedDB(),
      }),
      cascadeCacheControl: true,
      typeCacheDirectives,
    }),
    debugManager: debugManager({
      logger: { log },
      name: 'CLIENT',
      performance,
    }),
    requestManager: fetchManager({ url }),
    requestParser: requestParser({ introspection: githubIntrospection }),
    typeIDKey: DEFAULT_TYPE_ID_KEY,
  });
}

function buildRequestURL(hash) {
  if (!hash) return '*';
  return `${url}?requestId=${hash}`;
}

function mockRequest({ data, hash }) {
  const body = { data };
  const headers = { 'cache-control': 'public, max-age=5' };
  fetchMock.post(buildRequestURL(hash), { body, headers });
}

describe('@handl/client', () => {
  const realDateNow = Date.now.bind(window.Date);

  before(() => {
    window.Date.now = cy.stub().returns(Date.parse('June 6, 1979'));
  });

  after(() => {
    window.Date.now = realDateNow;
  });

  describe('request', () => {
    let cache, client, response;

    describe('no match', () => {
      before(async () => {
        mockRequest({ data: responses.singleTypeQuery.data });

        const typeCacheDirectives = {
          Organization: 'public, max-age=1',
        };

        try {
          client = await initClient({ typeCacheDirectives });
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

      it('correct response data', () => {
        cy.wrap(response).toMatchSnapshot();
      });

      it('correct cache data', () => {
        cy.wrap(cache).toMatchSnapshot();
      });
    });

    describe('query tracker match', () => {
      before(async () => {
        mockRequest({ data: responses.singleTypeQuery.data });

        const typeCacheDirectives = {
          Organization: 'public, max-age=1',
        };

        try {
          client = await initClient({ typeCacheDirectives });
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

      it('one request', () => {
        expect(fetchMock.calls()).to.have.lengthOf(1);
      });

      it('correct response data', () => {
        cy.wrap(response).toMatchSnapshot();
      });

      it('correct cache data', () => {
        cy.wrap(cache).toMatchSnapshot();
      });
    });

    describe('query response match', () => {
      before(async () => {
        mockRequest({ data: responses.singleTypeQuery.data });

        const typeCacheDirectives = {
          Organization: 'public, max-age=1',
        };

        try {
          client = await initClient({ typeCacheDirectives });
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

      it('no request', () => {
        expect(fetchMock.calls()).to.have.lengthOf(0);
      });

      it('correct response data', () => {
        cy.wrap(response).toMatchSnapshot();
      });

      it('correct cache data', () => {
        cy.wrap(cache).toMatchSnapshot();
      });
    });

    describe('request field path / data entity match', () => {
      before(async () => {
        mockRequest({ data: responses.singleTypeQuery.data });

        const typeCacheDirectives = {
          Organization: 'public, max-age=1',
        };

        try {
          client = await initClient({ typeCacheDirectives });
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

      it('no request', () => {
        expect(fetchMock.calls()).to.have.lengthOf(0);
      });

      it('correct response data', () => {
        cy.wrap(response).toMatchSnapshot();
      });

      it('correct cache data', () => {
        cy.wrap(cache).toMatchSnapshot();
      });
    });

    describe('request field path / data entity partial match', () => {
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
          Organization: 'public, max-age=3',
          Repository: 'public, max-age=3',
          RepositoryConnection: 'public, max-age=1',
          RepositoryOwner: 'public, max-age=3',
        };

        try {
          client = await initClient({ typeCacheDirectives });
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

      it('one request', () => {
        expect(fetchMock.calls()).to.have.lengthOf(1);
      });

      it('correct response data', () => {
        cy.wrap(response).toMatchSnapshot();
      });

      it('correct cache data', () => {
        cy.wrap(cache).toMatchSnapshot();
      });
    });
  });
});
