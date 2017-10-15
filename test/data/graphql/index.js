import md5 from 'md5';
import { requests, responses } from './github';

import {
  aliasQuery,
  fragmentQuery,
  inlineFragmentQuery,
  inlineFragmentQueryExtra,
  multiQuery,
  namedQuery,
  optionsInfoFragment,
  partOneQuery,
  partTwoQuery,
  priceFragment,
  singleQuery,
  skuQuery,
  variableQuery,
} from './tesco/requests';

/**
 *
 * @type {Object}
 */
export const github = { requests, responses };

/**
 *
 * @type {Object}
 */
export const tesco = { requests: {
  aliasQuery,
  fragmentQuery,
  inlineFragmentQuery,
  inlineFragmentQueryExtra,
  multiQuery,
  namedQuery,
  optionsInfoFragment,
  partOneQuery,
  partTwoQuery,
  priceFragment,
  singleQuery,
  skuQuery,
  variableQuery,
} };

/**
 *
 * @param {string} hash
 * @return {Object}
 */
export const getGQLResponse = function getGQLResponse(hash) {
  let response;
  const keys = Object.keys(github.requests);

  for (let i = 0; i < keys.length; i += 1) {
    if (md5(github.requests[keys[i]].replace(/\s/g, '')) === hash) {
      response = github.responses[keys[i]];
      break;
    }
  }

  return response;
};
