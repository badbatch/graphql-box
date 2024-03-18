import { init as map } from '@cachemap/map';
import fetchMock from 'fetch-mock';
import { type IntrospectionQuery } from 'graphql';
import { initClient } from '../../helpers/initClient.ts';
import { mockRequest, registerFetchMockWorker } from '../../modules/fetch-mock/index.ts';
import { type RawResponseDataWithMaybeCacheMetadata } from '@graphql-box/core';
import { hashRequest } from '@graphql-box/helpers';
import { githubIntrospection, parsedRequests, responses } from '@graphql-box/test-utils';
import { registerWorker } from '@graphql-box/worker-client';

const introspection = githubIntrospection as IntrospectionQuery;

global.Date.now = () => Date.parse('June 6, 1979 GMT');

fetchMock.config.fallbackToNetwork = true;
fetchMock.config.warnOnFallback = false;

mockRequest(fetchMock, {
  data: responses.singleTypeQuery.data,
  hash: hashRequest(parsedRequests.singleTypeQuery),
});

mockRequest(fetchMock, {
  data: responses.nestedTypeQuery.data,
  hash: hashRequest(parsedRequests.nestedTypeQuery),
});

mockRequest(fetchMock, {
  data: responses.nestedTypeQuerySet.initial.data,
  hash: hashRequest(parsedRequests.nestedTypeQuerySet.initial),
});

mockRequest(fetchMock, {
  data: (responses.nestedTypeQuerySet.updated as RawResponseDataWithMaybeCacheMetadata).data,
  hash: hashRequest(parsedRequests.nestedTypeQuerySet.updated),
});

const typeCacheDirectives = {
  Organization: 'public, max-age=1',
  Repository: 'public, max-age=3',
  RepositoryConnection: 'public, max-age=1',
  RepositoryOwner: 'public, max-age=3',
};

(() => {
  const client = initClient({
    cachemapStore: map(),
    debuggerName: 'WORKER',
    introspection,
    typeCacheDirectives,
  });

  registerFetchMockWorker();
  registerWorker({ client });
})();
