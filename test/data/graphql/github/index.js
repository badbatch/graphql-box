/* eslint-disable global-require */

import { aliasQuery, singleMutation, singleQuery, variableMutation } from './requests';

/**
 *
 * @type {Object}
 */
export const requests = {
  aliasQuery, singleMutation, singleQuery, variableMutation,
};

/**
 *
 * @type {Object}
 */
export const responses = {
  aliasQuery: require('./responses/alias-query/index.json'),
  singleMutation: require('./responses/single-mutation/index.json'),
  singleQuery: require('./responses/single-query/index.json'),
  variableMutation: require('./responses/single-mutation/index.json'),
};
