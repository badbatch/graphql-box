import Inventory from '../';
import SkuInventory from '../sku';

/**
 *
 * The product inventory data type
 */
export default class ProductInventory extends Inventory {
  /**
   *
   * @constructor
   * @param {Object} data
   * @return {void}
   */
  constructor(data) {
    super(data);
    this.skus = null;

    if (data.skus) {
      this.skus = [];

      data.skus.forEach((sku) => {
        this.skus.push(new SkuInventory(sku));
      });
    }
  }
}
