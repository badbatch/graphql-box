import { isBoolean } from 'lodash';

/**
 *
 * The link data type
 */
export default class Link {
  /**
   *
   * @constructor
   * @param {Object} data
   * @return {void}
   */
  constructor(data) {
    this.href = data.href || null;
    this.id = data.id || null;
    this.options = data.options || null;
    this.rel = data.rel || null;
    this.templated = isBoolean(data.templated) ? data.templated : null;
    this.type = data.type || null;
  }
}
