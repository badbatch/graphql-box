import { isArray } from 'lodash';
import Link from '../link';

/**
 *
 * The relationship data type
 */
export default class Relationship {
  /**
   *
   * @constructor
   * @param {Object} data
   * @return {void}
   */
  constructor(data) {
    this.links = null;

    if (isArray(data.links)) {
      this.links = [];

      data.links.forEach((link) => {
        this.links.push(new Link(link));
      });
    }
  }
}
