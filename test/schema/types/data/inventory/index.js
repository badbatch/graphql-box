import { isBoolean } from 'lodash';

/**
 *
 * The inventory data type
 */
export default class Inventory {
  /**
   *
   * @constructor
   * @param {Object} data
   * @return {void}
   */
  constructor(data) {
    this.availability = data.availability || null;
    this.available = isBoolean(data.available) ? data.available : null;
    this.id = data.id || null;
    this.subscribable = isBoolean(data.subscribable) ? data.subscribable : null;
  }
}
