/**
 *
 * The prices data type
 */
export default class Prices {
  /**
   *
   * @constructor
   * @param {Object} data
   * @return {void}
   */
  constructor(data) {
    this.clubcardPoints = data.clubcardPoints || null;
    this.fromPrice = data.fromPrice || null;
    this.price = data.price || null;
    this.savings = data.savings || null;
    this.toPrice = data.toPrice || null;
    this.was = data.was || null;
    this.wasWas = data.wasWas || null;
  }
}
