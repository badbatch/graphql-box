import { isArray, isBoolean, isPlainObject } from 'lodash';
import Link from '../link';
import SkuMediaAssets from '../media-assets/sku';
import Prices from '../prices';

/**
 *
 * The sku data type
 */
export default class Sku {
  /**
   *
   * @constructor
   * @param {Object} data
   * @return {void}
   */
  constructor(data) {
    this.ancestorCategories = data.ancestorCategories || null;
    this.attributes = data.attributes || null;
    this.authors = data.authors || null;
    this.avgRating = data.avgRating || null;
    this.bookDetails = data.bookDetails || null;
    this.commercialReleaseDateFormatted = data.commercialReleaseDateFormatted || null;
    this.displayName = data.displayName || null;
    this.id = data.id || null;
    this.links = null;

    if (isArray(data.links)) {
      this.links = [];

      data.links.forEach((link) => {
        this.links.push(new Link(link));
      });
    }

    this.longDescription = data.longDescription || null;
    if (isPlainObject(data.mediaAssets)) this.mediaAssets = new SkuMediaAssets(data.mediaAssets);
    this.miniDescription = data.miniDescription || null;
    this.noofRatingsProduced = data.noofRatingsProduced || null;
    this.prices = isPlainObject(data.prices) ? new Prices(data.prices) : null;
    this.publicLink = data.publicLink || null;
    this.rangedInStore = isBoolean(data.rangedInStore) ? data.rangedInStore : null;
    this.skuSynopsis = data.skuSynopsis || null;
    this.specification = data.specification || null;
  }
}
