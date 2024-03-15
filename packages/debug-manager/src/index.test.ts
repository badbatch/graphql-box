/**
 * @jest-environment jsdom
 */
import { Core } from '@cachemap/core';
import { init as map } from '@cachemap/map';
import { CacheManager } from '@graphql-box/cache-manager';
import {
  CACHE_ENTRY_ADDED,
  CACHE_ENTRY_QUERIED,
  DEFAULT_TYPE_ID_KEY,
  type DebugManagerDef,
  type PlainObject,
} from '@graphql-box/core';
import {
  getRequestContext,
  getRequestData,
  parsedRequests,
  requestFieldTypeMaps,
  responses,
} from '@graphql-box/test-utils';
import { expect, jest } from '@jest/globals';
import { DebugManager } from './index.ts';

const { performance } = window;

describe('@graphql-box/debug-manager >>', () => {
  const realDateNow = Date.now.bind(global.Date);
  let debugManager: DebugManagerDef;

  beforeAll(() => {
    globalThis.Date.now = jest.fn<() => number>().mockReturnValue(Date.parse('June 6, 1979 GMT'));
    jest.spyOn(global.navigator, 'userAgent', 'get').mockReturnValue('mock-userAgent');
  });

  afterAll(() => {
    global.Date.now = realDateNow;
  });

  describe('CacheManager >> CACHE_ENTRY_ADDED >>', () => {
    const response: PlainObject[] = [];

    beforeAll(() => {
      debugManager = new DebugManager({ name: 'CLIENT', performance });
      // @ts-expect-error property is private
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn<() => number>(debugManager._performance, 'now').mockReturnValue(0);

      debugManager.on('LOG', (message: string, payload: PlainObject) => {
        if (message === CACHE_ENTRY_ADDED) {
          response.push({ message, ...payload });
        }
      });

      const cacheManager = new CacheManager({
        cache: new Core({
          name: 'cachemap',
          store: map(),
          type: 'someType',
        }),
        cascadeCacheControl: true,
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const requestData = getRequestData(parsedRequests.singleTypeQuery);

      cacheManager.cacheQuery(
        requestData,
        requestData,
        responses.singleTypeQuery,
        {},
        getRequestContext({ debugManager, fieldTypeMap: requestFieldTypeMaps.singleTypeQuery })
      );
    });

    it('correct data emitted', () => {
      expect(response).toMatchSnapshot();
    });
  });

  describe('CacheManager >> CACHE_ENTRY_QUERIED >>', () => {
    const response: PlainObject[] = [];

    beforeAll(async () => {
      debugManager = new DebugManager({ name: 'CLIENT', performance });
      // @ts-expect-error property is private
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn<() => number>(debugManager._performance, 'now').mockReturnValue(0);

      debugManager.on('LOG', (message: string, payload: PlainObject) => {
        if (message === CACHE_ENTRY_QUERIED) {
          response.push({ message, ...payload });
        }
      });

      // @ts-expect-error property is private
      jest.spyOn(CacheManager, '_isValid').mockReturnValue(true);

      const cacheManager = new CacheManager({
        cache: new Core({
          name: 'cachemap',
          store: map(),
          type: 'someType',
        }),
        cascadeCacheControl: true,
        typeIDKey: DEFAULT_TYPE_ID_KEY,
      });

      const requestData = getRequestData(parsedRequests.singleTypeQuerySet.initial);

      cacheManager.cacheQuery(
        requestData,
        requestData,
        responses.singleTypeQuerySet.initial,
        {},
        getRequestContext({ fieldTypeMap: requestFieldTypeMaps.singleTypeQuery })
      );

      await cacheManager.analyzeQuery(
        getRequestData(parsedRequests.singleTypeQuery),
        {},
        getRequestContext({ debugManager, fieldTypeMap: requestFieldTypeMaps.singleTypeQuery })
      );
    });

    it('correct data emitted', () => {
      expect(response).toMatchSnapshot();
    });
  });
});
