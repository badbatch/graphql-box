import fetchMock from 'fetch-mock';

import {
  parse,
  print,
  TypeInfo,
  visit,
} from 'graphql';

import md5 from 'md5';
import { getGQLResponse } from '../data/graphql';
import { buildRestPath, getRestResponse } from '../data/rest';
import introspection from '../introspection/index.json';
import { localStorageMock, redisMock } from '../mocks';
import schema from '../schema';
import Client from '../../src';

import {
  addChildField,
  getChildField,
  getKind,
  getName,
  getRootField,
  getType,
  getTypeCondition,
  hasChildField,
} from '../../src/helpers/parsing';

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
export function createClient(mode, newInstance) {
  return mode === 'external' ? createExternalClient(newInstance) : createInternalClient(newInstance);
}

/**
 *
 * @param {string} request
 * @return {Object}
 */
export function mockGQLRequest(request) {
  const hash = md5(request.replace(/\s/g, ''));

  const matcher = (url, opts) => {
    const parsed = JSON.parse(opts.body);
    return md5(parsed.query.replace(/\s/g, '')) === hash;
  };

  const body = getGQLResponse(hash);
  fetchMock.mock(matcher, { body });
  return { body };
}

/**
 *
 * @param {string} key
 * @param {string|Array<string>} resource
 * @return {Object}
 */
export function mockRestRequest(key, resource) {
  const path = buildRestPath(key, resource);
  const matcher = url => url === `${tescoBaseURL}${path}`;
  const body = getRestResponse(key, resource);
  fetchMock.mock(matcher, { body: JSON.stringify(body) });
  return { body, path };
}

/**
 *
 * @param {Map} map
 * @return {Object}
 */
export function parseMap(map) {
  const obj = {};

  map.forEach((cacheability, key) => {
    obj[key] = cacheability.metadata;
  });

  return obj;
}

/**
 *
 * @param {string} query
 * @return {string}
 */
export function updateQuery(query) {
  const typeInfo = new TypeInfo(schema);

  return print(visit(parse(query), {
    enter(node) {
      typeInfo.enter(node);
      const kind = getKind(node);

      if (kind === 'Field' || kind === 'InlineFragment') {
        const isField = kind === 'Field';
        const isInlineFragment = kind === 'InlineFragment';
        const name = isField ? getName(node) : getName(getTypeCondition(node));
        if (isInlineFragment && name === typeInfo.getParentType().name) return;
        const type = isField ? getType(typeInfo.getFieldDef()) : schema.getType(name);
        if (!type.getFields) return;
        const fields = type.getFields();

        if (fields.id && !hasChildField(node, 'id')) {
          const mockAST = parse(`{ ${name} { id } }`);
          const fieldAST = getChildField(getRootField(mockAST, name), 'id');
          addChildField(node, fieldAST);
        }

        if (fields._metadata && !hasChildField(node, '_metadata')) {
          const mockAST = parse(`{ ${name} { _metadata { cacheControl } } }`);
          const fieldAST = getChildField(getRootField(mockAST, name), '_metadata');
          addChildField(node, fieldAST);
        }
      }
    },
    leave(node) {
      typeInfo.leave(node);
    },
  })).replace(/\s/g, '');
}
