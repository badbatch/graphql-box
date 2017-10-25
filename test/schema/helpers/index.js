import { castArray, flatten, isArray } from 'lodash';
import { dataEndpoints } from '../../data/rest';
import { tescoBaseURL } from '../../helpers';

/**
 *
 * @param {Object} args
 * @param {string} key
 * @param {Object} opts
 * @return {Array<string>}
 */
const buildURLs = function buildURLs(args, key, opts) {
  const path = dataEndpoints[key];
  const resource = castArray(args.id);
  const urls = [];

  if (!isArray(args.id) || opts.batch) {
    urls.push(`${tescoBaseURL}${path}/${resource.join(resource)}`);
  } else {
    resource.forEach((value) => {
      urls.push(`${tescoBaseURL}${path}/${value}`);
    });
  }

  return urls;
};

/**
 *
 * @private
 * @param {string} url
 * @return {Promise}
 */
const _fetch = async (url) => {
  const res = await fetch(url);
  return res.json();
};

/**
 *
 * @param {string} key
 * @param {Object} args
 * @param {Object} [opts]
 * @return {Promise}
 */
export const fetchData = async function fetchData(key, args, opts = {}) {
  const urls = buildURLs(args, key, opts);
  const promises = [];

  urls.forEach((value) => {
    promises.push(_fetch(value));
  });

  const data = flatten(await Promise.all(promises));
  const _metdata = { cacheControl: 'public, max-age=28800' };

  if (!isArray(args.id)) return { ...data[0], _metdata };
  return [{ ...data[0], _metdata }, { ...data[1], _metdata }];
};

/**
 *
 * @param {Object} data
 * @param {strimg} relation
 * @return {Array<Object>}
 */
export const getLinks = function getLinks({ links }, relation) {
  return links.filter(({ rel }) => rel === relation);
};
