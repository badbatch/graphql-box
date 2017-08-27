import fetchMock from 'fetch-mock';
import { isFunction } from 'lodash';
import md5 from 'md5';
import { getGQLResponse } from '../data/graphql';
import { buildRestPath, getRestResponse } from '../data/rest';
import introspection from '../introspection/index.json';
import { localStorageMock, redisMock } from '../mocks';
import schema from '../schema';
import Client from '../../src';

/**
 *
 * @type {Object}
 */
const localStorageOptions = { mock: localStorageMock };

/**
 *
 * @type {Object}
 */
const redisOptions = { mock: redisMock };

/**
 *
 * @type {Object}
 */
const cachemapOptions = {
  obj: {
    disableCacheInvalidation: true,
    localStorageOptions,
    redisOptions: { ...redisOptions, ...{ db: 0 } },
  },
  res: {
    disableCacheInvalidation: true,
    localStorageOptions,
    redisOptions: { ...redisOptions, ...{ db: 1 } },
  },
};

/**
 *
 * @type {string}
 */
export const githubURL = 'https://api.github.com/graphql';

/**
 *
 * @type {string}
 */
export const tescoBaseURL = 'https://www.tesco.com/direct/rest/';

/**
 *
 * @param {boolean} newInstance
 * @return {Client}
 */
export const createExternalClient = function createExternalClient(newInstance) {
  return new Client({
    cachemapOptions, introspection, mode: 'external', newInstance, url: githubURL,
  });
};

/**
 *
 * @param {boolean} newInstance
 * @return {Client}
 */
export const createInternalClient = function createInternalClient(newInstance) {
  return new Client({ cachemapOptions, mode: 'internal', newInstance, schema });
};

/**
 *
 * @param {string} mode
 * @param {boolean} newInstance
 * @return {Client}
 */
export const createClient = function createClient(mode, newInstance) {
  return mode === 'external' ? createExternalClient(newInstance) : createInternalClient(newInstance);
};

/**
 *
 * @param {string} request
 * @return {Object}
 */
export const mockGQLRequest = function mockGQLRequest(request) {
  const hash = md5(request.replace(/\s/g, ''));

  const matcher = (url, opts) => {
    const parsed = JSON.parse(opts.body);
    return md5(parsed.query.replace(/\s/g, '')) === hash;
  };

  const body = getGQLResponse(hash);
  fetchMock.mock(matcher, { body });
  return { body };
};

/**
 *
 * @param {string} key
 * @param {string|Array<string>} resource
 * @return {Object}
 */
export const mockRestRequest = function mockRestRequest(key, resource) {
  const path = buildRestPath(key, resource);
  const matcher = url => url === `${tescoBaseURL}${path}`;
  const body = getRestResponse(key, resource);
  fetchMock.mock(matcher, { body: JSON.stringify(body) });
  return { body, path };
};

/**
 *
 * @param {Map} map
 * @return {Object}
 */
export const parseMap = function parseMap(map) {
  const obj = {};

  map.forEach((value, key) => {
    const cacheObj = {};

    Object.keys(value).forEach((prop) => {
      if (isFunction(value[prop])) return;
      cacheObj[prop] = value[prop];
    });

    obj[key] = cacheObj;
  });

  return obj;
};
