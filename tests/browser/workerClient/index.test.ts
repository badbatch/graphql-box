import { type IntrospectionQuery } from 'graphql';
import { type ExportCacheResult } from '@graphql-box/cache-manager';
import { type PartialDehydratedRequestResult, type PartialRequestResult, type PlainArray } from '@graphql-box/core';
import { dehydrateCacheMetadata } from '@graphql-box/helpers';
import { githubIntrospection, parsedRequests } from '@graphql-box/test-utils';
import { type WorkerClient } from '@graphql-box/worker-client';
import { expected } from '../../expected/index.ts';
import { initWorkerClient } from '../../helpers/initWorkerClient.ts';
import { FetchMockWorker } from '../../modules/fetch-mock/index.ts';

const introspection = githubIntrospection as IntrospectionQuery;
const defaultOptions = { awaitDataCaching: true, returnCacheMetadata: true };

describe('workerClient', () => {
  describe('request', () => {
    let cache: ExportCacheResult;
    let fetchMockWorker: FetchMockWorker;
    let worker: Worker;
    let workerClient: WorkerClient;
    let response: Omit<PartialDehydratedRequestResult, 'requestID'>;

    describe('no match', () => {
      beforeAll(async () => {
        worker = new Worker(new URL('worker.ts', import.meta.url));
        fetchMockWorker = new FetchMockWorker(worker);
        workerClient = initWorkerClient({ introspection, worker });

        const { _cacheMetadata, data } = (await workerClient.query(parsedRequests.singleTypeQuery, {
          ...defaultOptions,
        })) as PartialRequestResult;

        response = { data };

        if (_cacheMetadata) {
          response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        }

        cache = await workerClient.cache.export();
      });

      afterAll(async () => {
        await fetchMockWorker.postMessage('resetHistory');
        await workerClient.cache.clear();
      });

      it('correct response data', () => {
        expect(response).toEqual(expected.noMatch.response);
      });

      it('correct cache data', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(cache).toEqual(jasmine.objectContaining(expected.noMatch.cache));
      });
    });

    describe('query tracker exact match', () => {
      beforeAll(async () => {
        worker = new Worker(new URL('worker.ts', import.meta.url));
        fetchMockWorker = new FetchMockWorker(worker);
        workerClient = initWorkerClient({ introspection, worker });
        const request = parsedRequests.singleTypeQuery;

        const result = await Promise.all([
          workerClient.query(request, { ...defaultOptions }),
          workerClient.query(request, { ...defaultOptions }),
        ]);

        const { _cacheMetadata, data } = result[1] as PartialRequestResult;
        response = { data };

        if (_cacheMetadata) {
          response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        }

        cache = await workerClient.cache.export();
      });

      afterAll(async () => {
        await fetchMockWorker.postMessage('resetHistory');
        await workerClient.cache.clear();
      });

      it('one request', async () => {
        const calls = (await fetchMockWorker.postMessage('calls', { returnValue: true })) as PlainArray;
        expect(calls).toHaveSize(1);
      });

      it('correct response data', () => {
        expect(response).toEqual(expected.queryTrackerExactMatch.response);
      });

      it('correct cache data', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(cache).toEqual(jasmine.objectContaining(expected.queryTrackerExactMatch.cache));
      });
    });

    describe('query tracker partial match', () => {
      beforeAll(async () => {
        worker = new Worker(new URL('worker.ts', import.meta.url));
        fetchMockWorker = new FetchMockWorker(worker);
        workerClient = initWorkerClient({ introspection, worker });

        const result = await Promise.all([
          workerClient.query(parsedRequests.nestedTypeQuery, { ...defaultOptions }),
          workerClient.query(parsedRequests.singleTypeQuery, { ...defaultOptions }),
        ]);

        const { _cacheMetadata, data } = result[1] as PartialRequestResult;
        response = { data };

        if (_cacheMetadata) {
          response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        }

        cache = await workerClient.cache.export();
      });

      afterAll(async () => {
        await fetchMockWorker.postMessage('resetHistory');
        await workerClient.cache.clear();
      });

      it('one request', async () => {
        const calls = (await fetchMockWorker.postMessage('calls', { returnValue: true })) as PlainArray;
        expect(calls).toHaveSize(1);
      });

      it('correct response data', () => {
        expect(response).toEqual(expected.queryTrackerPartialMatch.response);
      });

      it('correct cache data', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(cache).toEqual(jasmine.objectContaining(expected.queryTrackerPartialMatch.cache));
      });
    });

    describe('query response match', () => {
      beforeAll(async () => {
        worker = new Worker(new URL('worker.ts', import.meta.url));
        fetchMockWorker = new FetchMockWorker(worker);
        workerClient = initWorkerClient({ introspection, worker });
        const request = parsedRequests.singleTypeQuery;

        await workerClient.query(request, { ...defaultOptions });
        await fetchMockWorker.postMessage('resetHistory');

        const { _cacheMetadata, data } = (await workerClient.query(request, {
          ...defaultOptions,
        })) as PartialRequestResult;

        response = { data };

        if (_cacheMetadata) {
          response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        }

        cache = await workerClient.cache.export();
      });

      afterAll(async () => {
        await fetchMockWorker.postMessage('resetHistory');
        await workerClient.cache.clear();
      });

      it('no request', async () => {
        const calls = (await fetchMockWorker.postMessage('calls', { returnValue: true })) as PlainArray;
        expect(calls).toHaveSize(0);
      });

      it('correct response data', () => {
        expect(response).toEqual(expected.queryResponseMatch.response);
      });

      it('correct cache data', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(cache).toEqual(jasmine.objectContaining(expected.queryResponseMatch.cache));
      });
    });

    describe('request field path / data entity match', () => {
      beforeAll(async () => {
        worker = new Worker(new URL('worker.ts', import.meta.url));
        fetchMockWorker = new FetchMockWorker(worker);
        workerClient = initWorkerClient({ introspection, worker });
        const { full, initial } = parsedRequests.singleTypeQuerySet;

        await workerClient.query(full, { ...defaultOptions });
        await fetchMockWorker.postMessage('resetHistory');

        const { _cacheMetadata, data } = (await workerClient.query(initial, {
          ...defaultOptions,
        })) as PartialRequestResult;

        response = { data };

        if (_cacheMetadata) {
          response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        }

        cache = await workerClient.cache.export();
      });

      afterAll(async () => {
        await fetchMockWorker.postMessage('resetHistory');
        await workerClient.cache.clear();
      });

      it('no request', async () => {
        const calls = (await fetchMockWorker.postMessage('calls', { returnValue: true })) as PlainArray;
        expect(calls).toHaveSize(0);
      });

      it('correct response data', () => {
        expect(response).toEqual(expected.requestFieldPathDataEntityMatch.response);
      });

      it('correct cache data', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(cache).toEqual(jasmine.objectContaining(expected.requestFieldPathDataEntityMatch.cache));
      });
    });

    describe('request field path / data entity partial match', () => {
      beforeAll(async () => {
        const { full, initial } = parsedRequests.nestedTypeQuerySet;

        worker = new Worker(new URL('worker.ts', import.meta.url));
        fetchMockWorker = new FetchMockWorker(worker);
        workerClient = initWorkerClient({ introspection, worker });

        await workerClient.query(initial, { ...defaultOptions });
        await fetchMockWorker.postMessage('resetHistory');

        const { _cacheMetadata, data } = (await workerClient.query(full, {
          ...defaultOptions,
        })) as PartialRequestResult;

        response = { data };

        if (_cacheMetadata) {
          response._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        }

        cache = await workerClient.cache.export();
      });

      afterAll(async () => {
        await fetchMockWorker.postMessage('resetHistory');
        await workerClient.cache.clear();
      });

      it('one request', async () => {
        const calls = (await fetchMockWorker.postMessage('calls', { returnValue: true })) as PlainArray;
        expect(calls).toHaveSize(1);
      });

      it('correct response data', () => {
        expect(response).toEqual(expected.requestFieldPathDataEntityPartialMatch.response);
      });

      it('correct cache data', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(cache).toEqual(jasmine.objectContaining(expected.requestFieldPathDataEntityPartialMatch.cache));
      });
    });
  });
});
