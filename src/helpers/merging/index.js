import {
  cloneDeep,
  isArray,
  isEqual,
  isObjectLike,
  merge,
  mergeWith,
} from 'lodash';

/**
 *
 * @param {Object} obj
 * @param {Object} src
 * @param {Function} matcher
 * @return {Object}
 */
export default function mergeObjects(obj, src, matcher) {
  const newObj = cloneDeep(obj);

  return mergeWith(newObj, src, (objValue, srcValue, key) => {
    if (!isArray(objValue) || !isArray(srcValue)) return undefined;

    srcValue.forEach((val, i) => {
      const match = matcher(key, val);

      if (!match) {
        if (isObjectLike(objValue[i]) && isObjectLike(val) && !isEqual(objValue[i], val)) {
          merge(objValue[i], val);
        } else {
          objValue[i] = val;
        }

        return;
      }

      const index = objValue.findIndex(elm => match === matcher(key, elm));

      if (index === -1) {
        objValue.push(val);
        return;
      }

      if (isObjectLike(objValue[index]) && isObjectLike(val) && !isEqual(objValue[index], val)) {
        merge(objValue[index], val);
      } else {
        objValue[index] = val;
      }
    });

    return objValue;
  });
}
