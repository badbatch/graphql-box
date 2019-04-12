import Cachemap from '@cachemap/core';
import indexedDB from '@cachemap/indexed-db';
import cacheManager from '@handl/cache-manager';
import Client from '@handl/client';
import { DEFAULT_TYPE_ID_KEY } from '@handl/core';
import fetchManager from '@handl/fetch-manager';
import { dehydrateCacheMetadata } from '@handl/helpers';
import requestParser from '@handl/request-parser';
import { githubIntrospection, requestsAndOptions, responses } from '@handl/test-utils';
import fetchMock from 'fetch-mock';

const defaultOptions = { awaitDataCaching: true, returnCacheMetadata: true };

describe('@handl/client', () => {
  const realDateNow = Date.now.bind(window.Date);

  before(() => {
    window.Date.now = cy.stub().returns(Date.parse('June 6, 1979'));
  });

  after(() => {
    window.Date.now = realDateNow;
  });

  describe('request', () => {
    let cache, response;

    before(async () => {
      const client = await Client.init({
        cacheManager: cacheManager({
          cache: await Cachemap.init({
            name: 'cachemap',
            store: indexedDB(),
          }),
          cascadeCacheControl: true,
          typeCacheDirectives: {
            Organization: 'public, max-age=1',
          },
        }),
        requestManager: fetchManager({ url: 'https://api.github.com/graphql' }),
        requestParser: requestParser({ introspection: githubIntrospection }),
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const body = { data: responses.singleTypeQuery.data };
      const headers = { 'cache-control': 'public, max-age=5' };
      fetchMock.post('*', { body, headers });
      const { options, request } = requestsAndOptions.queryWithVariable;
      const { _cacheMetadata, data } = await client.request(request, { ...options, ...defaultOptions });
      response = { _cacheMetadata: dehydrateCacheMetadata(_cacheMetadata), data };
      cache = await client.cache.export();
    });

    it('correct response data', () => {
      cy.wrap(response).toMatchSnapshot();
    });

    it('correct cache data', () => {
      cy.wrap(cache).toMatchSnapshot();
    });
  });
});
