/**
 *
 * The six data type
 */
export default class DataType {
  /**
   *
   * @constructor
   * @param {Object} data
   * @return {void}
   */
  constructor(data) {
    if (data._Headers) {
      this._Headers = data._Headers;
    }
  }
}
