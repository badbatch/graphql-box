import Inventory from '../';
import ListingInventory from '../listing';

/**
 *
 * The sku inventory data type
 */
export default class SkuInventory extends Inventory {
  /**
   *
   * @constructor
   * @param {Object} data
   * @return {void}
   */
  constructor(data) {
    super(data);
    this.listings = null;

    if (data.listings) {
      this.listings = [];

      data.listings.forEach((listing) => {
        this.listings.push(new ListingInventory(listing));
      });
    }
  }
}
