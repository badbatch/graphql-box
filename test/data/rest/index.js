/* eslint-disable global-require */

import { castArray, isArray } from 'lodash';

/**
 *
 * @type {Object}
 */
export const productData = {
  '402-5806': require('./responses/product/402-5806.json'),
};

/**
 *
 * @type {Object}
 */
export const skuData = {};

/**
 *
 * @type {Object}
 */
export const inventoryProductData = {};

/**
 *
 * @type {Object}
 */
export const inventorySkuData = {};

/**
 *
 * @type {Object}
 */
export const accessoriesData = {};

/**
 *
 * @type {Object}
 */
export const rangeData = {};

/**
 *
 * @type {Object}
 */
export const endpointData = {
  productData,
  skuData,
  inventoryProductData,
  inventorySkuData,
  accessoriesData,
  rangeData,
};

/**
 *
 * @type {Object}
 */
export const dataEndpoints = {
  product: 'content/catalog/product',
  sku: 'content/catalog/sku',
  inventoryProduct: 'inventory/product',
  inventorySku: 'inventory/sku',
  accessories: 'content/relationships/accessories',
  range: 'content/relationships/range',
};

/**
 *
 * @param {string} key
 * @param {string|Array<string>} resource
 * @return {string}
 */
export const buildRestPath = function buildRestPath(key, resource) {
  const castResource = castArray(resource);
  const path = dataEndpoints[key];
  return isArray(resource) ? `${path}/${castResource.join()}` : `${path}/${resource}`;
};

/**
 *
 * @param {string} key
 * @param {string|Array<string>} resource
 * @return {Object}
 */
export const getRestResponse = function getRestResponse(key, resource) {
  const castResource = castArray(resource);
  const data = endpointData[`${key}Data`];
  const response = [];

  castResource.forEach((value) => {
    if (!data[value]) return;
    response.push(data[value]);
  });

  return isArray(resource) ? response : response[0];
};
